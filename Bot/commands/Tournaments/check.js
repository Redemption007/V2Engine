/* eslint-disable no-nested-ternary */
/* eslint-disable no-multi-spaces */
const {Util} = require('discord.js')
const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {
    const tournoi = await client.getTournoi({StaffChannelID: message.channel.id})
    if (!tournoi) return message.reply('Cette commande doit être éxécutée dans un salon de staff d\'un tournoi en cours !')
    const settings = client.getGuild(message.guild)
    const StaffChannel = message.guild.channels.cache.get(tournoi.StaffChannelID)
    const InfosChannel = message.guild.channels.cache.find(ch => ch.name === 'infos-tournoi' && ch.parentID === StaffChannel.parentID)
    const filterMessages = m => m.author.id === message.author.id
    const filterClassement = r => r.users.fetch(message.author.id) && !r.me && ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'].includes(r._emoji.name)
    const filterReaction = r => r.users.cache.size>1 && r.users.fetch(message.author.id) && ['✅', '❌'].includes(r._emoji.name)
    let classement = 3
    let desc = ''
    let field = ''
    let error = false

    //On check si dans tournoi.NextRound il y a marqué "finale","ID", et alors on embraye sur la finale :
    if (tournoi.NextRound[0] === "Finale") {
        const lobby_finale = message.guild.channels.cache.get(tournoi.NextRound[1])
        //• On demande le classement (combien d'équipes sont classées ? puis lesquelles, dans l'ordre)
        const msgclassement = await message.reply({embeds: [{description: 'Merci de réagir avec le chiffre donnant le nombre d\'équipes qui seront affichées dans le classement.', color: 'DARK_GREEN', footer: {text: 'Vous avez 30 secondes pour réagir, après quoi la commande sera annulée.', icon_url: message.author.avatarURL()}}]})
        msgclassement.react('1️⃣')
        msgclassement.react('2️⃣')
        msgclassement.react('3️⃣')
        msgclassement.react('4️⃣')
        msgclassement.react('5️⃣')
        await msgclassement.awaitReactions({filterClassement, max: 1, time: 30000})
            .then(reaction => {
                switch(reaction.first()._emoji.name) {
                case '1️⃣':
                    classement = 1
                    break
                case '2️⃣':
                    classement = 2
                    break
                case '3️⃣':
                    classement = 3
                    break
                case '4️⃣':
                    classement = 4
                    break
                case '5️⃣':
                    classement = 5
                    break
                }
            })
            .catch(() => { error = true })
        if (error) return message.reply('La commande est annulée car vous avez mis trop de temps à répondre.')
        msgclassement.reactions.removeAll()
        let j = 0
        try {
            for (let i=0; i<classement; i++) {
                msgclassement.edit({embeds: [{description: `Quelle est l'ID de l'équipe qui remporte ce tournoi ? (${i+1}${i<1?'ère':'ème'} place)`}]})
                await message.channel.awaitMessages({filterMessages, max: 1, time: 30000})
                    .then(async coll => {
                        const tid = coll.first().content.replace(/^<@!/, '').replace(/>$/, '')
                        const team = await tournoi.Inscrits.find(tm => {
                            if (tournoi.Compo>2) return tm.id === tid
                            return tm.members[0].userid === tid
                        })
                        if (!team) return message.reply(`L'${tournoi.Compo>2? 'équipe' : `utilisateur (${coll.first().content})`} d'identifiant ${tid} n'existe pas ${tournoi.Compo>2? '!':'ou n\'est pas inscrit !'}`)
                        desc += `${i+1}${i<1?'ère':'ème'} place ${i<2? i<1? '🥇' : '🥈' : '🥉'} • `
                        field += '\n'
                        team.members.forEach(usr => {
                            desc += `<@${usr.userid}>\n`
                            field += `=>  ${usr.pseudo}\n`
                        })
                        coll.first().delete()
                    })
                j = i
            }
        } catch (err) { message.reply(`Suite à une erreur, seuls les ${j} premiers seront affichés au lieu des ${classement} prévus.`) }
        InfosChannel.send({content: `<@&${tournoi.RoleTournoi}>`, embeds: [{color: 'BLUE', title: 'Classement du tournoi :', fields: [{name: 'Places :', value: desc, inline: true}, {name: 'Pseudos :', value: field, inline: true}], footer: {text: 'Les gagnants sont invités à DM les organisateurs du tournoi.'}}]})
        //• On supprime le lobby de finale
        lobby_finale.delete('Fin du tournoi')
        tournoi.NextRound = []
        tournoi.save()
        //• On envoie un message dans le channel du staff en rappelant dans taper deletetournoi pour supprimer tous les salons
        return StaffChannel.send(`Le tournoi est terminé. Quand vous n'aurez plus besoin des derniers salons, faites \`${settings.prefix}deletetournoi\``)
    }
    // SI CE N'EST PAS LA FINALE :

    //- On demande tous les ID des équipes/users qu'on veut désigner gagnants (en un seul message)
    let team_ids = []                //Renseigne les id des équipes
    let teams = []                   //Renseigne les équipes concernées
    let lobb = []                    //Renseigne les lobbys concercés par les équipes de même index
    let lobbys = ''                  //Liste des lobbys concernés
    let ids = ''                     //Liste des équipes concernées
    let team = ''                    //Équipe à laquelle correspond l'id
    const channelresearcher = ch => {
        const parent = ch.parentID === message.channel.parentID
        const name = ch.name === `lobby-${Math.ceil(tournoi.Inscrits.indexOf(team)/tournoi.Lobbys)+1}`
        return parent && name
    }
    await message.reply({embeds: [{description: `Donnez les ID d'${tournoi.Compo<2? 'utilisateurs' : 'équipes'} que vous voulez déclarer vainqueurs.\nSchéma : \`<id1> <id2> <id3> <etc>\``, color: 'PURPLE'}]})
    await message.channel.awaitMessages({filterMessages, max: 1, time: 30000})
        .then(coll => team_ids = coll.first().content.trim().split(' '))
        .catch(() => { error = true })
    if (error) return message.reply('La commande est annulée car vous avez mis trop de temps à répondre.')
    //- Si le tournoi est en solo :
    if (tournoi.Compo < 2) {
        //- On check si tous les ID sont bons et ne sont pas déjà inscrits pour le prochain round avant de faire quoi que ce soit
        for (let i=0; i<team_ids.length; i++)  {
            team_ids[i] = team_ids[i].replace(/^<@!/, '')
            team_ids[i] = team_ids[i].replace(/>$/, '')
            team = await tournoi.Inscrits.find(tm => tm.members[0].userid === team_ids[i])
            const already = await tournoi.NextRound.find(m => m.userid === team_ids[i])
            if (already) return message.reply(`L'utilisateur d'identifiant ${team_ids[i]} (<@!${team_ids[i]}>) est déjà inscrit pour le tour suivant !`)
            if (!team) return message.reply(`L'utilisateur d'identifiant ${team_ids[i]} (<@!${team_ids[i]}>) n'existe pas ou n'est pas inscrit !`)
            const lobby = await message.guild.channels.cache.find(channelresearcher)
            lobb.push(lobby)
            teams.push(team)
            lobbys += `<#${lobby.id}>\n`
            ids += `<@${team_ids[i]}>\n`
        }
    } else {
        //- On check si tous les ID sont bons et ne sont pas déjà inscrits pour le prochain round avant de faire quoi que ce soit
        for (let i=0; i<team_ids.length; i++) {
            team = await tournoi.Inscrits.find(tm => tm.id === team_ids[i])
            const already = await tournoi.NextRound.find(m => m.userid === team_ids[i])
            if (already) return message.reply(`L'équipe d'identifiant ${team_ids[i]} est déjà inscrite pour le tour suivant !`)
            if (!team) return message.reply(`L'équipe d'identifiant ${team_ids[i]} n'existe pas !`)
            const lobby = await message.guild.channels.cache.find(channelresearcher)
            lobb.push(lobby)
            teams.push(team)
            lobbys += `<#${lobby.id}>\n`
            ids += `${team_ids[i]}\n`
        }
    }

    // - On demande confirmation générale
    const mesg = await message.reply({embeds: [{color: 'ORANGE', title: `Confirmez vous déclarer gagnant${tournoi.Compo>2?'e':''}s ces ${tournoi.Compo<2? 'utilisateurs':'équipes'} ?`, fields: [{name: 'IDs :', value: ids, inline: true}, {name: 'Lobbys concernés :', value: lobbys, inline: true}], footer: {text: 'Vous avez 30 secondes pour confirmer', icon_url: message.author.avatarURL()}}]})
    mesg.react('✅')
    mesg.react('❌')
    await mesg.awaitReactions({filterReaction, max: 1, time: 30000})
        .then(coll => coll.first()._emoji.name === '✅')
        .catch(() => { error = true })
    if (error) return message.reply('La commande a été annulée.')
    mesg.reactions.removeAll()

    // - On envoie les informations dans les channels
    for (let i = 0; i < teams.length; i++) {
        lobb[i].send({embeds: [{title: 'Résultats :', color: 'GREEN', description: `${tournoi.Compo<2? `<@${teams[i].members[0].userid}>` : `L''équipe ${teams[i].id}`} a été désigné${tournoi.Compo>2?'e':''} vainqueur du lobby${tournoi.Gagnants<2? '. Merci de votre participation.' : '. Merci d\'attendre la parution des résultats complets.'}`}]})
    }

    //- On active la fonction nextRound()
    const newlist = await client.nextRound(tournoi, teams)

    //On confirme à l'utilisateur que la commande s'est bien déroulée
    await mesg.edit({embeds: [{color: 'ORANGE', title: `Ces ${tournoi.Compo<2? 'utilisateurs':'équipes'} ont étés déclaré${tournoi.Compo>2?'e':''}s gagnant${tournoi.Compo>2?'e':''}s :`, fields: [{name: 'IDs :', value: ids, inline: true}, {name: 'Lobbys concernés :', value: lobbys, inline: true}], footer: {icon_url: message.author.avatarURL()}}]})

    //• On a pas fini de rentrer tous les gagnants : il ne se passe rien
    if (newlist.length < Math.ceil((tournoi.Inscrits.length-1)/tournoi.Lobbys)*tournoi.Gagnants) return

    //• On a fini de rentrer tous les gagnants, et on updateInscrits()
    const nextround = await client.updateInscrits(tournoi, tournoi.NextRound)
    const Lobbys = await message.guild.channels.cache.filter(ch => ch.parentID === message.channel.parentID && ch.name.startsWith('lobby'))
    let inscrits = ''
    let pseudos = ''

    //On envoie la nouvelle liste des joueurs au staff
    if (tournoi.Compo === 1) {
        await nextround.forEach(e => {
            inscrits += `<@${e.members[0].userid}> --\n`
            pseudos += `--> ${e.members[0].pseudo}\n`
        });

        StaffChannel.send({embeds: [{title: `Liste des participants au tournoi ${tournoi.NomduTournoi} :`, color: 'BLUE', fields: [{name: 'Participants :', value: Util.splitMessage(inscrits), inline: true}, {name: 'Peudos de jeu :', value: Util.splitMessage(pseudos), inline: true}]}]})
    } else {
        await nextround.forEach(async e => {
            inscrits += `**__Équipe n°${nextround.indexOf(e)} :__**  --\n`
            pseudos += `--> ID: ${await nextround[nextround.indexOf(e)].id}\n`
            await e.members.forEach(mbr => {
                inscrits += `<@${mbr.userid}> --\n`
                pseudos += `--> ${mbr.pseudo}\n`
            })
        });
        await StaffChannel.send({embeds: [{
            title: `Liste des participant[s au tournoi ${tournoi.NomduTournoi} :`,
            color: 'BLUE',
            fields: [
                {name: 'Équipes :', value: Util.splitMessage(inscrits), inline: true},
                {name: 'Peudos de jeu :', value: Util.splitMessage(pseudos), inline: true}
            ]
        }]})
    }
    //On supprime les lobbys actuels
    await Lobbys.forEach(chan => chan.delete('Tour fini'))
    tournoi.NextRound = []
    await tournoi.save()

    //On émet l'event createlobbys
    return client.emit('createlobbys', client, tournoi, settings)
}
module.exports.help = MESSAGES.Commandes.Tournaments.CHECK;
