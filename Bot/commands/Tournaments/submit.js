/* eslint-disable no-case-declarations */
const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, _args, settings) => {
    if (!message.channel.name.startsWith('lobby-')) return message.reply('vous ne pouvez pas effectuer cette commande en dehors d\'un lobby d\'un tournoi en cours.')
    const StaffChannel = await message.guild.channels.cache.find(ch => ch.name === 'staff-tournoi' && ch.parentID === message.channel.parentID)
    const tournoi = await client.getTournoi({StaffChannelID: StaffChannel.id})
    if (!tournoi) return message.reply('vous ne pouvez pas effectuer cette commande en dehors d\'un lobby d\'un tournoi en cours.')
    const filterReaction = reac => reac.users.cache.get(message.author.id) && !reac.me && ['✅', '🔄', '❌'].includes(reac._emoji.name)

    const msg = await message.reply({embed: {title: 'Confirmation des résultats', color: 'AQUA', description: `> Assurez-vous d'avoir pris au moins un screenshot par match disputé.\n\n**__Voici les étapes pour procéder à l'envoi des résultats :__**\n\`1 -\` Celui qui a fait la commande doit envoyer les captures d'écran dans ce lobby.\n\`2 -\` Une fois tous les screens envoyés, réagissez par ce message avec ✅\n\`3 -\` Attendez de recevoir la confirmation de ces résultats.\n\`4 -\` Une fois vos résultats confirmés, attendez patiemment que les autres lobbys valident les leurs. Ce lobby sera alors supprimé et d'autres lobbys seront créés, jusqu'à la finale.\n\n:warning: Si vous vous êtes trompé pendant l'exécution de cette commande, réagissez avec 🔄 à ce message avec pour relancer la commande (__*Supprimer les messages ne sert à rien*__).\n❌ Pour annuler la commande.`, footer: {text: 'Vous avez 2 minutes pour confirmer vos résultats, après quoi la commande sera annulée.'}}})
    msg.react('✅')
    msg.react('🔄')
    msg.react('❌')
    await msg.awaitReactions(filterReaction, {max: 1, idle: 120000})
        .then(async coll => {
            const emoji = coll.first()._emoji.name

            switch (emoji) {
            case '❌':
                await msg.delete()
                return message.reply('commande annulée.')

            case '🔄':
                await msg.delete()
                return client.commands.get('submit').run(client, message)

            case '✅':
                const nb = message.channel.position
                let desc = ''
                let field = ''
                const list_teams_lobby = async i => {
                    try {
                        if (tournoi.Compo === 1) {
                            const user = await tournoi.Inscrits[i+tournoi.Lobbys*nb].members[0]
                            desc += `\n<@${user.userid}> --`
                            field += `\n -> ${user.pseudo}`
                        } else {
                            desc += `\n__*Équipe n°${i+1}*__ --`
                            field += `\n -> ID : ${await tournoi.Inscrits[i+tournoi.Lobbys*nb].id}`
                            await tournoi.Inscrits[i+tournoi.Lobbys*nb].members.forEach(mbr => {
                                desc += `\n<@${mbr.userid}> --`
                                field += `\n -> ${mbr.pseudo}`
                            })
                        }
                    } catch (e) { console.log('Il manque une équipe dans ce lobby !'); }
                }

                const files = []
                const collect = await message.channel.messages.fetch({after: msg.id})
                const collected = await collect.filter(m => {
                    const fichier = m.attachments.first()
                    const meme_auteur = m.author.id === message.author.id
                    return fichier && meme_auteur
                })
                await collected.each(async ms => {
                    await ms.attachments.each(picture => files.push(picture.url))
                    ms.pin()
                })
                message.channel.send({embed: {color: 'GOLD', title: 'Vérification des résultats en cours...', footer: {text: 'Merci de patienter, le staff traite votre demande.'}}})
                await StaffChannel.send(`Résultats du <#${message.channel.id}> • ${files.length} fichier${files.length>1? 's.' : '.'}`)
                await files.forEach(async file => {
                    await StaffChannel.send(file)
                })
                for (let j=0; j<tournoi.Lobbys; j++) {
                    await list_teams_lobby(j)
                }
                await StaffChannel.send({embed: {title: 'Liste des équipes du lobby concerné :', color: 'PURPLE', fields: [{name: 'Membres :', value: desc, inline: true}, {name: 'Pseudos:', value: field, inline: true}]}})
                await StaffChannel.send({embed: {color: 'GOLD', description: `Faites \`${settings.prefix}check <teamID_or_userID>\` pour confirmer un résultat de lobby pour une équipe. Pour désigner plusieurs équipes gagnantes, listez les ID en les espaçant d'un espace.\n> Si tous les fichiers n'ont pas été envoyés, la totalité des fichiers se trouve en message épinglé dans le lobby : <#${message.channel.id}>`}})
                break
            }
        })
}
module.exports.help = MESSAGES.Commandes.Tournaments.SUBMIT;
