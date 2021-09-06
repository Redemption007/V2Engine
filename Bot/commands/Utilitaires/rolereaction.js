const {MessageEmbed} = require('discord.js')
const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {

    const warning = 'ATTENTION : Pour chaque question qui suivra, vous aurez 30 secondes pour répondre. \
    Au-delà de cette durée, la commande sera annulée.'
    const canceled = `Oups ! <@${message.author.id}>, la commande est annulée car vous avez dépassé le temps imparti.`
    let messageID = ''
    let channelID = ''
    let Emoji
    let Role
    let rr = 2
    let choix = ''
    let channelRR
    let messageRR
    const filterID = msg => msg.author.id === message.author.id && (msg.content.startsWith(`https://discord.com/channels/${message.guild.id}/`) || msg.content.toLowerCase() === 'cancel')
    const filterReaction = reac => reac.users.cache.get(message.author.id) && !reac.me
    const filterRole = mesg => mesg.mentions.roles.lastKey !== 0 && mesg.author.id === message.author.id

    await message.channel.send(warning, {embed: {color: 'PURPLE', description: 'Quel est le lien du message concerné ?'}})
        .then(async msg1 => {
            try {
                await message.channel.awaitMessages(filterID, {max: 1, idle: 30000})
                    .then(async collected1 => {
                        if (collected1.first().content.toLowerCase() === 'cancel') return msg1.edit('La commande a été annulée.')
                        const contenu1 = await collected1.first().content.slice(`https://discord.com/channels/${message.guild.id}/`.length).split('/')

                        channelID = contenu1[0]
                        messageID = contenu1[1]
                        await collected1.first().delete()
                    })
                await msg1.edit(warning, {embed: {color: 'PURPLE', description: `> L'id du message est : ${messageID}\n\
> Le salon concerné est <#${channelID}>.\n> Le lien du message est <https://discord.com/channels/${message.guild.id}/${channelID}\
/${messageID}>.`, fields: [{name: 'Prochaine étape :', value: 'Réagissez avec la réaction que vous souhaitez mettre :'}]}})
                await msg1.awaitReactions(filterReaction, {max: 1, idle: 30000})
                    .then(async collected2 => {
                        Emoji = await collected2.first().emoji
                    })
                await msg1.reactions.removeAll()
                await msg1.edit(warning, {embed: {color: 'PURPLE', description: `> L'émoji avec lequel réagir est  ${Emoji}`,
                    fields: [{name: 'Prochaine étape :', value: 'Mentionnez le rôle concerné (@role) ?'}]}})
                await message.channel.awaitMessages(filterRole, {max: 1, idle: 30000})
                    .then(async collected3 => {
                        if (collected3.first().content.toLowerCase() === 'cancel') return msg1.edit('La commande a été annulée.')
                        Role = await collected3.first().mentions.roles.first()
                        collected3.first().delete()
                    })
                await msg1.edit(warning, {embed: {color: 'PURPLE', description: `> Le rôle ajouté/supprimé sera <@&${Role.id}>`,
                    fields: [{name: 'Prochaine étape :', value: "Quel est l'effet de l'ajout de la réaction ?\n\
:one: Ajoute le rôle à l'utilisateur.\n\
:two: Donne le rôle quand l'utilisateur ajoute la réaction, et lui supprime ce rôle quand il l'enlève.\n\
:three: Retire le rôle à l'utilisateur.\n\
:four: Supprime le rôle quand l'utilisateur ajoute la réaction, et lui ajoute ce rôle quand il l'enlève."}]}})
                msg1.react('1️⃣')
                msg1.react('2️⃣')
                msg1.react('3️⃣')
                msg1.react('4️⃣')
                await msg1.awaitReactions(filterReaction, {max: 1, idle: 30000})
                    .then(collected4 => {
                        switch (collected4.first()._emoji.name) {
                        case '1️⃣':
                            rr = 1
                            choix = 'Ajoute le rôle à l\'utilisateur.'
                            break
                        case '3️⃣':
                            rr = 3
                            choix = 'Retire le rôle à l\'utilisateur.'
                            break
                        case '4️⃣':
                            rr = 4
                            choix = 'Supprime le rôle quand l\'utilisateur ajoute la réaction, et lui ajoute ce rôle quand il l\'enlève.'
                            break
                        default:
                            rr = 2
                            choix = 'Donne le rôle quand l\'utilisateur ajoute la réaction, et lui supprime ce rôle quand il l\'enlève.'
                            break
                        }
                    })
                await msg1.reactions.removeAll()
                await msg1.edit(warning, {embed: {color: 'PURPLE', description: `> Vous avez choisi l'option n°${rr} : ${choix}`}})
                channelRR = await message.guild.channels.cache.get(channelID)
                messageRR = await channelRR.messages.fetch(messageID)
                await messageRR.react(Emoji)
                const embed2 = new MessageEmbed()
                    .setTitle('ROLE REACTION')
                    .setColor('PURPLE')
                    .addField('__Channel :__', `<#${channelID}>`, true)
                    .addField('__Lien du message :__', `(Cliquez ici)[https://discord.com/channels/${message.guild.id}/${channelID}/${messageID}]`, true)
                    .addField('__Réaction :__', `${Emoji}`, false)
                    .addField('__Rôle ajouté :__', `<@&${Role.id}>`, true)
                    .addField('__Type de Reaction Role :__', `N°${rr} : *${choix}*`, false)
                    .setTimestamp()
                    .setFooter(`Role Reaction exécuté par ${message.author.tag}.`)

                await message.channel.send(embed2)
                await msg1.delete()
                const messageReactor = await client.getReactor(messageRR)

                if (messageReactor) {
                    return client.updateReactor(messageRR, {
                        typeReactor: 'Role',
                        typeAction: rr,
                        emojis: Emoji.name,
                        channelsending: 'none',
                        autre: Role.id
                    })
                }
                await client.createReactor({
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    msgReactorID: messageID,
                    typeReactor: ['Role'],
                    typeAction: [rr],
                    emojis: [Emoji.name],
                    channelsending: ['none'],
                    autre: [Role.id]
                })
            } catch (e) {
                msg1.edit(canceled)
            }
        })
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ROLEREACTION;

/*
Possibilité d'activer ou non le DM lors de l'ajout/du remote du rôle.
*/
