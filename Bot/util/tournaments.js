/* eslint-disable no-multi-spaces */
const mongoose = require('mongoose');
const Tournoi = require('../modeles/tournoi');

module.exports = client => {

    client.createTournoi = async tournoi => {
        const merged = Object.assign({_id: new mongoose.Types.ObjectId()}, tournoi)
        const createTournoi = await new Tournoi(merged)
        await createTournoi.save(function (err) { if (err) console.error(); })
        return createTournoi._id
    }

    client.getTournoi = async object => {
        const data = await Tournoi.findOne(object);

        if (data) return data;
    }

    client.registerTournoi = async (tournoi, one) => {
        if (tournoi.Compo === 1 || tournoi.Random) {
            await tournoi.Inscrits.push({members: [one]})

            return tournoi.save(function (err) { if (err) console.error(); })
        }
        const guild = await client.guilds.fetch(tournoi.guildID)
        const newcomer = await guild.members.fetch(one.userid)

        await tournoi.Inscrits.forEach(async team => {
            if (team.id === one.teamid) {
                await team.members.forEach(async member => {
                    const Member = await guild.members.fetch(member.userid)

                    await Member.send({embeds: [{title: 'Un membre a rejoint votre team !', description: `<@${newcomer.id}> (${newcomer.tag}) a rejoint votre équipe !\nPseudo de jeu : ${one.pseudo}`, color: 'DARK_GREEN', footer: {text: `Nombre de personnes dans l'équipe : ${team.members.length+1}/${tournoi.Compo}`}}]})
                })
                team.members.push({userid: one.id, pseudo: one.pseudo})

                return tournoi.save(function (err) { if (err) console.error(); })
            }
        })
        await tournoi.Inscrits.push({id: one.teamid, members: [{userid: one.id, pseudo: one.pseudo}]})

        return tournoi.save(function (err) { if (err) console.error(); })
    }

    client.askTeam = async (tournoi, one) => {
        const guild = await client.guilds.fetch(tournoi.guildID)
        const incompletes = await tournoi.Inscrits.filter(team => team.members.length < tournoi.Compo)
        const random = await guild.members.fetch(one.userid)
        let messages = []

        incompletes.forEach(async team => {
            const chef = await guild.members.fetch(team.members.first().userid)

            await chef.send({embeds: [{color: 'PURPLE', title: 'Un membre demande à vous rejoindre !', description: `Sur le serveur ${guild.name}, à propos du tournoi ${tournoi.NomduTournoi} ;\n> <@${one.userid}> (tag : ${random.user.tag}, pseudo de jeu : ${one.pseudo}) veut vous rejoindre ! Voici sa courte présentation :\n:speech_balloon: ${one.speech}`, footer: {text: 'Vous avez 24h pour répondre à cette proposition. Si réagir à ce message n\'a pas d\'effet, c\'est que le membre est déjà dans une équipe.'}, timestamp: Date.now()}]})
                .then(async msg => {
                    await msg.react('✅')
                    await msg.react('❌')
                    await messages.push(msg.id)
                })
        })
        client.createReactor({
            guildID: guild.id,
            guildName: guild.name,
            msgReactorID: '',
            msgReactor: one,
            typeReactor: 'Tournoi',
            typeAction: [tournoi],
            emojis: ['✅', '❌'],
            autre: messages
        })
    }

    client.unregisterTournoi = async (Tournoi, member) => {
        const tournoi = await client.getTournoi({_id: Tournoi._id})
        const i = await tournoi.Inscrits.findIndex(tm => tm.members.find(mbr => mbr.userid === member.id))
        if (i === -1) throw new Error('Pas inscrit !')
        const j = await tournoi.Inscrits[i].members.findIndex(mbr => mbr.userid === member.id)

        await tournoi.Inscrits[i].members.splice(j, 1)
        if (tournoi.Inscrits[i].members.length === 0) await tournoi.Inscrits.splice(i, 1)

        return tournoi.save(function (err) { if (err) console.error(); })
    }

    client.updateInscrits = async (tournoi, memberlist) => {
        let newlist = []

        if (memberlist.length === 1) return
        if (tournoi.Random || tournoi.Compo === 1) {
            await memberlist.forEach(async userid => {
                const team = await tournoi.Inscrits.findIndex(t => t.members[0].userid === userid)
                const user = await tournoi.Inscrits[team].members[0]

                newlist.push({members: [user]})
            })
        } else {
            await memberlist.forEach(async userid => {
                const team = await tournoi.Inscrits.find(t => t.members[0].userid === userid)
                const teamIndex = await tournoi.Inscrits.indexOf(team)
                const user = await tournoi.Inscrits[teamIndex].members.find(mbr => mbr.userid === userid)
                const already = newlist.findIndex(t => t.id === team.id)

                if (already !== -1) {
                    await newlist[already].members.push(user)
                } else {
                    newlist.push({id: team.id, members: [user]})
                }
            })
            const notfull = await newlist.filter(tm => tm.members.length < tournoi.Compo)

            if (notfull && !tournoi.Incomplets) {
                await notfull.forEach(async tm => {
                    const index = await newlist.findIndex(t => t.id === tm.id)
                    const guild = await client.guilds.cache.find(guild => guild.id === tournoi.guildID)

                    await newlist[index].members.forEach(async mbr => {
                        const user = await guild.members.cache.get(mbr.userid)

                        await user.send({embeds: [{title: 'Oops !', color: 'RED', description: "Par manque de participants, votre équipe n'était pas complète. Les équipes incomplètes n'étant pas autorisées, vous avez été désinscrit du tournoi.", footer: {text: "La précision de l'interdiction des équipes incomplètes a été précisée avant le début du tournoi : soyez plus prévoyant la prochaine fois !"}, timestamp: Date.now()}]})
                    })
                    await newlist.splice(index, 1)
                })
            }
        }
        tournoi.Inscrits = await newlist
        await tournoi.save(function (err) { if (err) console.error(); })

        return tournoi.Inscrits
    }

    client.randomTeams = async tournoi => {
        let newlist = []
        let index = []
        let participants = await tournoi.Inscrits.length

        for (let i=0; i < participants; i++) {                                     //Pour chaque participant
            let random = participants                                              //Condition initiale pour rentrer dans la boucle ensuite
            let teamid = 1000000000 + Math.round(Math.random()*1000000000)         //On crée un id au hasard

            while (index.find(e => e === random) || random>= participants) {       //Si l'index correspondant à un participant est déjà dans la liste
                random = Math.round(Math.random()*participants)                    //On prend un autre index au hasard
            }
            index.push(random)                                                     //Qu'on ajoute à la liste pour pas le choisir la prochaine fois
            const user = await tournoi.Inscrits[random].members[0]                 //On choisit le membre correspondant à l'index choisi.

            if (newlist.length >= tournoi.NbdeTeams) {                             //Si la liste des équipes est pleine
                const dispo = newlist.findIndex(t => t.members.length < tournoi.Compo)  //On cherche s'il n'y a pas une équipe incomplète
                newlist[dispo].members.push(user)                                  //Auquel cas on y rajoute l'utilisateur
            } else {
                newlist.push({id: teamid, members: [user]})                        //Sinon, on rajoute une nouvelle équipe
            }
        }
        const solos = await newlist.filter(t => t.members.length<tournoi.Compo)    //On check s'il reste au moins 2 équipes incomplètes

        if (solos) {
            while (solos.length>1) {                                               //Auquel cas on prend les deux premières équipes trouvées
                const team1Index = await newlist.indexOf(solos[0])
                const team2Index = await newlist.indexOf(solos[1])                 //Et on commence à compléter la première team avec des membres de la seconde
                while (newlist[team1Index].members.length<tournoi.Compo || newlist[team2Index].members.length>0) {
                    await newlist[team1Index].members.push(newlist[team2Index].members[0])
                    await newlist[team2Index].members.splice(0, 1)                 //En ajoutant les membres à la première et les supprimant de la seconde
                }
                if (newlist[team2Index].members.length === 0) {                    //Si la seconde team est vide, on la supprime de la liste des équipes incomplètes
                    await solos.splice(1, 1)
                }
                if (newlist[team1Index].members.length >= tournoi.Compo) {         //Si la première team est pleine, on la supprime de la liste des équipes incomplètes
                    await solos.splice(0, 1)
                }
            }                                                                      //Et on recommence tant qu'il y a au moins 2 équipes incomplètes
            if (solos.length===1 && !tournoi.Incomplets) {                         //S'il ne reste qu'une seule équipe incomplète alors qu'elles ne sont pas autorisées
                const index = await newlist.indexOf(solos[0])                      //On désinscrit les utilisateurs concernés
                const guild = await client.guilds.cache.find(guild => guild.id === tournoi.guildID)

                await newlist[index].members.forEach(async mbr => {
                    const user = await guild.members.cache.get(mbr.userid)

                    await user.send({embeds: [{title: 'Oops !', color: 'RED', description: "Par manque de participants, votre équipe n'était pas complète. Les équipes incomplètes n'étant pas autorisées, vous avez été désinscrit du tournoi.\nNous nous excusons de la gêne occasionnée.", footer: {text: "Cette désinscription a été faite au hasard par le bot, l'équipe de modération n'a donc rien à voir avec ceci."}, timestamp: Date.now()}]})
                })
                await newlist.splice(index, 1)
            }
        }
        tournoi.Inscrits = newlist                                                  //On remplace l'ancienne liste avec la nouvelle contenant les équipes formées
        await tournoi.save(function (err) { if (err) console.error(); })            //Et on save
        return tournoi.Inscrits                                                     //Tout en retournant la nouvelle liste des équipes pour pouvoir l'utiliser si besoin
    }

    client.nextRound = async (tournoi, team) => {
        for (let i=0; i< team.length; i++) {
            if (tournoi.Compo < 2) {
                await tournoi.NextRound.push(team[i].members[0])
            } else { await team[i].members.forEach(t => tournoi.NextRound.push(t)) }
        }
        await tournoi.save(function (err) { if (err) console.error(); })

        return tournoi.NextRound
    }

    client.deleteTournoi = tournoi => Tournoi.deleteOne({StaffChannelID: tournoi.StaffChannelID})
}
