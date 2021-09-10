/* eslint-disable no-useless-escape */
/* eslint-disable no-case-declarations */
const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, _args, settings) => {
    const tournoi = await client.getTournoi({InscriptionsChannelID: message.channel.id})
    
    if (!tournoi) return message.reply("Vous n'avez pas envoyé la commande dans un salon d'inscriptions.")
    const guild = await client.getGuild(message.guild)
    const banned = await guild.Banned.find(e => e === message.author.id)
    const registered = await tournoi.Inscrits.find(e => e.members.find(mbr => mbr.userid === message.author.id))
    const maxed = tournoi.Inscrits.length > tournoi.NbdeTeams
    const places = await tournoi.Inscrits.find(team => team.members.length < tournoi.Compo)
    const filterReaction = reac => {
        const code_team = reac._emoji.name === '👥'
        const searching = reac._emoji.name === '🔎' && places
        const creating = reac._emoji.name === '🆕' && !maxed
        return reac.users.cache.size>1 && ( code_team || searching || creating)
    }
    const filterNumber = async msg => {
        if (msg.author.id !== message.author.id) return false
        await tournoi.Inscrits.forEach(tm => {
            if (tm.id === +msg.content) return true
        })
        msg.reply('Cet identifiant n\'est pas valide !')
        return false
    }
    // eslint-disable-next-line no-unused-vars
    const filter = () => { return true }
    const erreur = {embeds: [{title: 'Oups !', color: 'RED', description: 'La commande à été annulée car vous avez mis trop de temps à répondre.'}]}
    let pseudo = ''
    let profil = ''
    let choix = ''
    let footer = {text: "Vous avez été averti par DM si vous avez autorisé le bot."}
    let msg

    if (tournoi.InscriptionsDate.valueOf()-Date.now()>0) return message.reply("Les inscriptions n'ont pas encore débuté.")
    if (tournoi.Date.valueOf()-tournoi.InscriptionsFin<Date.now()) return message.reply("Les inscriptions sont terminées !")
    if (banned) return message.reply('Vous ne pouvez pas vous inscrire à ce tournoi.')
    if (registered) return message.reply("Vous étiez déjà inscrit.")
    if (!places && maxed && !tournoi.Random) return message.reply('Il ne reste plus de places pour ce tournoi.')
    if (tournoi.Random && tournoi.NbdeTeams*tournoi.Compo <= tournoi.Inscrits.length) return message.reply('Il ne reste plus de places pour ce tournoi.')
    if (tournoi.Compo > 1 && !tournoi.Random) {
        await message.reply("Merci de regarder vos MP pour continuer votre inscription.")
        try {
            await message.author.send('Inscription au tournoi en cours :')
                .then(mesg => msg = mesg)
        } catch (e) {
            return message.reply("Merci d'autoriser les DM des membres du serveur pour que vous puissiez continuer votre inscription en privé.")
        }
        try {
            await msg.edit({embeds: [{title: 'Inscription : Etape 1', color: 'BLUE', description: 'Merci de renseigner votre pseudo de jeu :', footer: {text: 'Vous avez 1 minute maximum pour répondre à cette question.'}}]})
            await msg.channel.awaitMessages({filter: filter, max: 1, time: 30000})
                .then(coll => {
                    pseudo = coll.first().content
                })
            let desc = ""

            if (tournoi.Inscrits.length) desc += "👥 - Rejoindre une équipe déjà créée avec un code"
            if (places) desc += "\n🔎 - Demander à rejoindre une équipe au hasard"
            if (!maxed) desc += "\n🆕 - Créer une nouvelle équipe"

            await message.author.send({embeds: [{color: 'BLUE', title: 'Voulez-vous :', description: desc}]})
                .then(mesg => msg = mesg)
            if (tournoi.Inscrits.length) msg.react('👥')
            if (places) msg.react('🔎')
            if (!maxed) msg.react('🆕')
            await msg.awaitReactions({filter: filterReaction, max: 1, time: 300000})
                .then(async coll => {
                    choix = await coll.first()._emoji.name
                })
            switch (choix) {
            case '👥':
                await message.author.send({embeds: [{title: 'Inscription : Etape 2', description: 'Merci de renseigner votre code d\'équipe :', footer: {text: 'Vous avez 1 minute maximum pour répondre à cette question.'}}]})
                await msg.channel.awaitMessages({filter: filterNumber, max: 1, idle: 30000, errors: 'time'})
                    .then(async collected => {
                        const team = await tournoi.Inscrits.find(teaam => teaam.id === +collected.first().content)
                        if (team) {
                            await client.registerTournoi(tournoi, {id: message.author.id, pseudo: pseudo, teamid: +collected.first().content})
                            const membre = await message.guild.members.cache.get(message.author.id)
                            await membre.roles.add(tournoi.RoleTournoi)
                            return message.author.send({embeds: [{title: 'Inscription réussie !', color: 'GREEN', description: "Votre équipe a été notifiée de votre arrivée :partying_face:", timestamp: Date.now()}]})
                        }
                        return message.author.send('La procédure est annulée, veuillez recommencer l\'inscription, et saisir un code d\'équipe valide, ou bien créer votre propre équipe.')
                    })
                break
            case '🔎':
                await message.author.send({embeds: [{title: 'Inscription : Etape 2', description: "Merci d'écrire une courte description de votre profil :", footer: {text: "Vous avez 2 minute pour répondre à cette question."}, timestamp: Date.now()}]})
                await msg.channel.awaitMessages({filter: filter, max: 1, idle: 120000, errors: 'time'})
                    .then(async msgs => {
                        profil = await msgs.first().content
                        return client.askTeam(tournoi, {id: message.author.id, pseudo: pseudo, speech: profil})
                    })
                    .catch(() => message.author.send(erreur))
                await message.author.send("Votre description a bien été envoyé ! Les équipes ont 24h pour vous accepter. Passé ce délai, votre inscription sera annulée si aucune équipe ne vous a prise.")
                return client.clock(async (tnid, user) => {
                    const to = await client.getTournoi({_id: tnid})
                    const integrated = await to.Inscrits.find(tm => tm.members.find(usr => usr.userID === user.id))
                    if (!integrated) user.send('Personne n\'ayant accepté votre demande, votre inscription est annulée.')
                }, 24*3600, tournoi._id, message.author)
            case '🆕':
                const team = 1000000000 + Math.round(Math.random()*1000000000)
                const membre = await message.member
                await membre.roles.add(tournoi.RoleTournoi)
                await message.author.send({embeds: [{color: 'GREEN', title: 'Inscription réussie !', fields: [{name: 'Attention :', value: 'Si vous voulez inviter quelqu\'un dans votre équipe, il vous faut partager votre code. **Vous ne pouvez pas enlever quelqu\'un de votre équipe !** Partagez donc ce code avec parcimonie.'}, {name: "Code d'équipe :", value: `${team}`}], footer: {text: 'Partagez-le avec vos coéquipiers, il leur permettra de rejoindre votre équipe.'}, timestamp: Date.now()}]})
                                            
                return client.registerTournoi(tournoi, {id: message.author.id, pseudo: pseudo, teamid: team})
            default: console.log("J'ai mal fait mon bail (C:\Users\blmak\Desktop\Node.js\Bot\commands\Tournaments\register.js)");
            }
        } catch (e) {
            message.author.send(`<@${message.author.id}>, la commande est annulée car vous avez mis trop de temps à répondre.`)
            return console.log(e);
        }
    } else {
        await message.channel.send({content: `<@${message.author.id}>`, embeds: [{
            title: 'Inscription en cours... !',
            description: "Merci de renseigner ici votre pseudo de jeu :",
            color: 'ORANGE'
        }]})
            .then(mesg => msg = mesg)
        await message.channel.awaitMessages({filter: filter, max: 1, idle: 30000, errors: 'time'})
            .then(async coll => {
                pseudo = await coll.first().content
                coll.first().delete()
            })
        await client.registerTournoi(tournoi, {userid: message.author.id, pseudo: pseudo})
        const member = await message.guild.members.cache.get(message.author.id)
        const User = await client.getUser(message.author)

        member.roles.add(tournoi.RoleTournoi)
        if (User.dmable) {
            message.author.send(`Vous venez de vous inscrire avec succès au tournoi ${tournoi.NomduTournoi} dans <#${message.channel.id}>\nFaites \`${settings.prefix}unregister\` dans ce même salon pour vous désinscrire.`).catch(() => footer = {text: 'Vous n\'êtes pas contactable par DM'})
        }

        return msg.edit({content: `<@${message.author.id}>`, embeds: [{title: 'Inscription finie !', description: 'Vous avez été inscrit avec succès à ce tournoi !', timestamp: Date.now(), footer: footer}]})
    }
}
module.exports.help = MESSAGES.Commandes.Tournaments.REGISTER;
