const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args, settings) => {
    const dbUser = await client.getUser(message.author)

    if (args.length) {
        switch (args[0]) {
        case 'true':
            message.channel.send({embeds: [{color: 'GREEN', title: `${message.author.tag} vous avez autorisé le bot à vous DM avec succès !`}]})
            await client.updateUser(message.author, {dmable: true})
            break
        default:
            message.channel.send({embeds: [{color: 'GREEN', title: `${message.author.tag} vous avez interdit le bot à vous DM avec succès !`}]})
            await client.updateUser(message.author, {dmable: false})
            break
        }

        return
    }
    switch (dbUser.dmable) {
    case true:
        message.channel.send({embeds: [{color: 'GREEN', title: `Les DM du bot sont activés. Tapez \`${settings.prefix}dm false\` pour les désactiver.`}]})
        break
    case false:
        message.channel.send({embeds: [{color: 'GREEN', title: `Les DM du bot sont désactivés. Tapez \`${settings.prefix}dm true\` pour les réactiver.`}]})
        break
    }
}
module.exports.help = MESSAGES.Commandes.Utilitaires.DM;
