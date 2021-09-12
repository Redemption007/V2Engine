/* eslint-disable no-nested-ternary */

module.exports = async (client, tournoiid) => {
    const tournoi = await client.getTournoi({_id: tournoiid})
    const settings = await client.getGuild({id: tournoi.guildID})
    const StaffChannel = await client.channels.cache.get(tournoi.StaffChannelID)
    const InfosChannel = await client.channels.cache.find(ch => ch.name === "infos-tournoi" && ch.parentID === StaffChannel.parentID)
    const filterCheckin = async (reaction, user) => {
        if (user.bot || reaction._emoji.name !== '✅') {
            if (user.id !== client.user.id) reaction.users.remove(user)
            return false
        }
        const reactionneur = await reaction.message.guild.members.fetch(user)
        const have_the_role = await reactionneur.roles.cache.get(tournoi.RoleTournoi)
        return have_the_role
    }
    let checkedUsers = []
    let inscrits = ''
    let pseudos = ''

    await StaffChannel.send(`<@&${settings.staffrole}> Début du check-in, tenez-vous prêts !`)
    const message = await InfosChannel.send({content: `Début du check-in ! <@&${tournoi.RoleTournoi}>`, embeds: [{title: 'Réagissez pour confirmer', color: 'ORANGE', footer: {text: "L'équipe de modération du serveur se réserve le droit de vous refuser l'accès au tournoi à tout moment"}, description: `Si vous ne cochez pas la réaction ✅ ci-dessous, vous serez automatiquement disqualifié du tournoi.\n\n__**Fin du checkin à :**__ *${tournoi.Date.getHours()} heures et ${tournoi.Date.getMinutes()} minutes.*`}]})
    await message.react('✅')

    const checkinCollector = message.createReactionCollector({filter: filterCheckin, time: 300000, dispose: true})
    checkinCollector.on('collect', (reaction, user) => {
        let FOOTER
        tournoi.Compo === 1 ? FOOTER = 'Merci d\'attendre la fin du checkin pour pouvoir commencer le tournoi.' : tournoi.Incomplets? FOOTER = "N'oubliez pas de rappeler à toute votre équipe de se check, sinon vous aurez une équipe incomplète.":FOOTER ="N'oubliez pas de rappeler à toute votre équipe de se check, sinon vous serez désinscrits."
        if (tournoi.Random) FOOTER = "Les équipes vont être faites automatiquement, merci de patienter."
        user.send({embeds: [{
            title: `Vous avez été check avec succès au tournoi ${tournoi.NomduTournoi} !`,
            color: 'GREEN',
            description: `Il ne vous reste maintenant plus qu'à attendre le début de celui-ci ! Soyez vigilants à l'horaire !`,
            footer: {text: FOOTER}
        }]}).catch()
        checkedUsers.push(user.id)
    })
    checkinCollector.on('remove', (reaction, user) => {
        const index = checkedUsers.indexOf(user.id)
        checkedUsers.splice(index, 1)
        let teamToo
        tournoi.Incomplets? teamToo=' mais votre équipe restera inscrite.':teamToo=' avec l\'ensemble de votre équipe.'
        user.send({embeds: [{
            title: `Vous n'êtes plus check au tournoi ${tournoi.NomduTournoi} !`,
            color: 'GREEN',
            description: `Vous serez donc désinscrits dès la fin du check-in${teamToo}`
        }]}).catch()
    })
    checkinCollector.on('end', async collection => {
        collection.delete(client.user.id)
        if (collection.size!==checkedUsers.length) console.log('Il y a un problème dans l\'event `collect`.');
        if (checkedUsers.length<2) return message.channel.send('Trop peu de monde s\'est inscrit ; Le tournoi est donc annulé !')
        await checkedUsers.forEach(usr => message.guild.members.cache.get(usr).send({embeds: [{color: 'GREEN', title: "Le tournoi commence maintenant !"}]}).catch())
        message.delete()
        let list = await client.updateInscrits(tournoi, checkedUsers)

        if (tournoi.Compo === 1) {
            await list.forEach(e => {
                inscrits += `<@${e.members[0].userid}> --\n`
                pseudos += `--> ${e.members[0].pseudo}\n`
            });
            await StaffChannel.send({embeds: [{title: `Liste des participants au tournoi ${tournoi.NomduTournoi} :`, color: 'BLUE', fields: [{name: 'Participants :', value: inscrits, inline: true}, {name: 'Peudos de jeu :', value: pseudos, inline: true}]}]})
        } else {
            if (tournoi.Random) list = await client.randomTeams(tournoi)
            await list.forEach(async e => {
                inscrits += `**__Équipe n°${list.indexOf(e)} :__**\n`
                pseudos += '\n'
                await e.members.forEach(mbr => {
                    inscrits += `<@${mbr.userid}> --\n`
                    pseudos += `--> ${mbr.pseudo}\n`
                })
            });
            await StaffChannel.send({embeds: [{
                title: `Liste des participants au tournoi ${tournoi.NomduTournoi} :`,
                color: 'BLUE',
                fields: [
                    {name: 'Équipes :', value: inscrits, inline: true},
                    {name: 'Peudos de jeu :', value: pseudos, inline: true}
                ]
            }]})
        }

        return client.emit('createlobbys', tournoi)
    })
}
