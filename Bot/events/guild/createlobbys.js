module.exports = async (client, tournoiid) => {
    const Tournoi = await client.getTournoi({_id: tournoiid})
    const settings = await client.getGuild({id: Tournoi.guildID})
    const guild = await client.guilds.fetch(Tournoi.guildID)
    const StaffChannel = await guild.channels.cache.get(Tournoi.StaffChannelID)
    let edit
    let lobbys = []
    let field1 = ''
    let field2 = ''
    let nbrooms = Math.ceil((Tournoi.Inscrits.length-1)/Tournoi.Lobbys)
    const creation_lobbys = numberlobby => {
        edit = {embeds: [{
            color: 'ORANGE',
            title: `Création du lobby ${numberlobby} et de ses permissions...`,
            footer: {text: "Merci de patienter pendant la création du Tournoi : tout est automatique."}
        }]}

        return edit
    }

    if (Tournoi.Inscrits.length%Tournoi.Lobbys === 1) {
        await StaffChannel.send(`L'équipe d'ID ${Tournoi.Inscrits[Tournoi.Inscrits.length-1].id} passe directement au tour suivant car elle n'avais pas d'opposant contre qui jouer.`)
        await client.nextRound(Tournoi, Tournoi.Inscrits[Tournoi.Inscrits.length-1])
    }
    const message = await StaffChannel.send('Merci de patienter...')
    for (let i=0; i < nbrooms; i++) {
        let lobby = `**__Lobby n°${i+1} :__**`
        let pseudos = ``

        await message.edit('Merci de patienter...', creation_lobbys(i+1))
        await guild.channels.create(`lobby-${i+1}`, {
            type: 'text',
            parent: StaffChannel.parentID,
            permissionOverwrites: [
                {
                    id: settings.staffrole,
                    allow: ['READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
                    type: 'role'
                },
                {
                    id: message.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                    type: 'role'
                }
            ],
            position: 1+i
        }).then(ch => {
            lobbys.push(ch)
            pseudos += `<#${ch.id}>`
        })
        for (let j=0; j<Tournoi.Lobbys; j++) {
            try {
                Tournoi.Compo > 1 ? lobby += `\n__*Équipe n°${i+1}.${j+1}*__ --` : '\n'
                Tournoi.Compo > 1 ? pseudos += `\n -> ID : ${await Tournoi.Inscrits[j+Tournoi.Lobbys*i].id}` : '\n'
                await Tournoi.Inscrits[j+Tournoi.Lobbys*i].members.forEach(async mbr => {
                    lobby += `\n<@${mbr.userid}> --`
                    pseudos += `\n -> ${mbr.pseudo}`
                    await lobbys[i].updateOverwrite(mbr.userid, {
                        'MANAGE_CHANNELS': false,
                        'ADD_REACTIONS': true,
                        'VIEW_CHANNEL': true,
                        'SEND_MESSAGES': true,
                        'MANAGE_MESSAGES': false,
                        'EMBED_LINKS': true,
                        'ATTACH_FILES': true,
                        'READ_MESSAGE_HISTORY': true
                    })
                })
            } catch (e) {}
        }
        field1 += `\n\n${lobby}`
        field2 += `\n\n${pseudos}`
    }
    //Si un seul lobby est créé, on prépare la finale
    if (nbrooms === 1) {
        Tournoi.NextRound[0] = "Finale"
        Tournoi.NextRound[1] = lobbys[0].id
    }
    await message.edit('Merci de patienter...', {embeds: [{title: 'Envoi des informations dans chaque lobby...', color: 'ORANGE', footer: {text: "Merci de patienter pendant la création du tournoi : tout est automatique."}}]})
    await lobbys.forEach(lobby => {
        lobby.send('@everyone', {embeds: [{title: 'Instructions :', description: `Bienvenue dans le <#${lobby.id}>\n\nMerci de vous entendre entre vous pour créer une room et jouer ensemble.\n\n> Une fois vos parties finies, merci de taper la commande \`${settings.prefix}submit\` et de suivre les instructions pour pouvoir continuer le tournoi.`, footer: {text: 'Bon tournoi à tous !'}, color: 'AQUA'}]})
    })
    await message.edit("Création des lobbys terminée ! Les informations ont été envoyées ! Tout est prêt pour le tournoi.", {
        embeds: [{
            title: 'Voici la liste des lobbys et leurs équipes :',
            color: 'DARK_GREEN',
            fields: [{name: 'Équipes :', value: field1, inline: true}, {name: 'Pseudos :', value: field2, inline: true}],
            footer: {text: `Nous vous remercions de votre patience. Faites \`${settings.prefix}help check\` pour savoir comment déclarer un vainqueur.`}
        }]
    })

    return message.pin()
}
