const {MESSAGES} = require('../../starterpack/constants')
const {MessageEmbed} = require('discord.js')

module.exports.run = async (client, message) => {

    const warning = "ATTENTION : Pour chaque question qui suivra, vous aurez 30 secondes pour répondre. \
Au-delà de cette durée, la commande sera annulée. Tapez `cancel` pour annuler la commande."
    const canceled = `Oups ! <@${message.author.id}>, la commande est annulée car vous avez dépassé le temps imparti.`
    let messageID = ''
    let channelID = ''
    let Emoji
    let contenuDM = ''
    let channelDMR
    let messageDMR
    let dmr = 1
    let choix = ''
    let ChannelErrID
    const filterID = msg => msg.author.id === message.author.id && (msg.content.startsWith(`https://discord.com/channels/${message.guild.id}/`) || msg.content.toLowerCase() === 'cancel')
    const filterReaction = reac => reac.users.cache.get(message.author.id)
    const filter = mesg => mesg.author.id === message.author.id
    const filterChannel = ms => ms.mentions.channels.first()

    await message.channel.send(warning)
        .then(async message1 => {
            try {
                await message1.edit({content: warning, embeds: [{color: 'PURPLE', description: `Quel est le lien du message concerné ?`}]})

                await message.channel.awaitMessages({filter: filterID, max: 1, idle: 30000})
                    .then(async collected1 => {
                        if (collected1.first().content.toLowerCase() === 'cancel') return message1.edit(`La commande a été annulée.`)
                        const contenu1 = await collected1.first().content.slice(`https://discord.com/channels/${message.guild.id}/`.length).split('/')

                        channelID = contenu1[0]
                        messageID = contenu1[1]
                        await collected1.first().delete()
                    })
                await message1.edit({content: warning, embeds: [{color: 'PURPLE', description: `> L'id du message est : ${messageID}\n> Le salon concerné est <#${channelID}>.\n\
                    > Le lien du message est <https://discord.com/channels/${message.guild.id}/${channelID}/${messageID}>.`, fields: [{name: 'Prochaine étape :', value: 'Réagissez avec la réaction que vous souhaitez mettre :'}]}]})
                await message1.awaitReactions({filter: filterReaction, max: 1, idle: 30000})
                    .then(collected2 => {
                        Emoji = collected2.first().emoji
                    })
                await message1.edit({content: warning, embeds: [{color: `PURPLE`, description: `> L'émoji avec lequel réagir est  ${Emoji}`, fields: [{name: 'Prochaine étape :', value: 'Quel est le contenu à envoyer par DM ? (1min pour répondre à cette question)'}]}]})
                await message1.reactions.removeAll()
                await message.channel.awaitMessages({filter: filter, max: 1, idle: 60000})
                    .then(async collected3 => {
                        if (collected3.first().content.toLowerCase() === 'cancel') return message1.edit(`La commande a été annulée.`)
                        contenuDM = await collected3.first().content
                        await collected3.first().delete()
                    })
                await message1.edit({content: warning, embeds: [{color: `PURPLE`, description: `> Le contenu envoyé par DM sera :\n:speech_balloon: ${contenuDM}`, fields: [
                    {name: 'Prochaine étape :', value: 'Que\
 voulez-vous qu\'il se passe si l\'utilisateur a désactivé les DM sur le serveur ?\n\
:one: Le contenu est envoyé avec mention sur un salon spécial.\n\
:two: Une mention est envoyée sur ce salon spécial pour demander à l\'utilisateur d\'autoriser les DM sur le serveur.\n\
:three: Rien ne se passe.'}
                ]}]})
                message1.react('1️⃣')
                message1.react('2️⃣')
                message1.react('3️⃣')
                await message1.awaitReactions({filter: filterReaction, max: 1, idle: 30000})
                    .then(collected4 => {
                        switch (collected4.first()._emoji.name) {
                        case '3️⃣':
                            dmr = 3
                            choix = 'Rien ne se passe.'
                            break
                        case '2️⃣':
                            dmr = 2
                            choix = 'Une mention est envoyée sur ce salon spécial pour demander à l\'utilisateur d\'autoriser les DM sur le serveur.'
                            break
                        default:
                            dmr = 1
                            choix = 'Le contenu est envoyé avec mention sur un salon spécial.'
                            break
                        }
                    })
                await message1.reactions.removeAll()
                if (dmr === 1 || dmr === 2) {
                    message1.edit({content: warning, embeds: [{color: 'PURPLE', title: `> Vous avez choisi l'option n°${dmr} :`, description: `${choix}`, fields: [{name: 'Prochaine étape :', value: 'Dans quel salon (#salon) voulez-vous que le message s\'envoie ?'}]}]})
                    await message.channel.awaitMessages({filter: filterChannel, max: 1, idle: 30000})
                        .then(async msges => {
                            if (msges.first().content.toLowerCase() === 'cancel') return message1.edit(`La commande a été annulée.`)
                            ChannelErrID = await msges.first().mentions.channels.first().id
                            await msges.first().delete()
                        })
                } else {
                    ChannelErrID = 'none'
                }
                channelDMR = await message.guild.channels.cache.get(channelID)
                messageDMR = await channelDMR.messages.fetch(messageID)
                await messageDMR.react(Emoji)
                const embed2 = new MessageEmbed()
                    .setTitle('DMREACTION')
                    .setColor('PURPLE')
                    .addField('__Channel :__', `<#${channelID}>`, true)
                    .addField('__Lien du message :__', `(Cliquez pour y aller)[https://discord.com/channels/${message.guild.id}/${channelID}/${messageID}]`, true)
                    .addField('__Réaction :__', `${Emoji}`, false)
                    .addField('__Contenu du DM :__', `:speech_balloon: ${contenuDM}`, false)
                    .setTimestamp()
                    .setFooter(`DMReaction exécuté par ${message.author.tag}.`)

                await message.channel.send({embeds: [embed2]})
                await message1.delete()
                const messageReactor = await client.getReactor(messageDMR)

                if (messageReactor) {
                    return client.updateReactor(messageDMR, {
                        typeReactor: 'DM',
                        typeAction: dmr,
                        emojis: Emoji.name,
                        channelsending: ChannelErrID,
                        autre: contenuDM
                    })
                }
                await client.createReactor({
                    guildID: message.guild.id,
                    guildName: message.guild.name,
                    msgReactorID: messageDMR.id,
                    typeReactor: ['DM'],
                    typeAction: [dmr],
                    emojis: [Emoji.name],
                    channelsending: [`${ChannelErrID}`],
                    autre: [contenuDM]
                })
            } catch (e) {
                message1.edit(canceled)
            }
        })
}
module.exports.help = MESSAGES.Commandes.Utilitaires.DMREACTION;
