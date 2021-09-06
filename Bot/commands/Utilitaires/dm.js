const {MESSAGES} = require('../../starterpack/constants')
const embed = require('../../commands/Utilitaires/embed')

module.exports.run = async (client, message, args, settings) => {
    const dbUser = await client.getUser(message.author)

    if (args.length) {
        switch (args[0]) {
        case 'true':
            embed.run(client, message, `GREEN;; ${message.author.tag} vous avez autorisé le bot à vous DM avec succès !`)
            await client.updateUser(message.author, {dmable: true})
            break
        default:
            embed.run(client, message, `GREEN;; ${message.author.tag} vous avez interdit le bot à vous DM avec succès !`)
            await client.updateUser(message.author, {dmable: false})
            break
        }

        return
    }
    switch (dbUser.dmable) {
    case true:
        embed.run(client, message, `GREEN;; Les DM du bot sont autorisés. Tapez \`${settings.prefix}dm false\` pour les désactiver.`)
        break
    case false:
        embed.run(client, message, `RED;; Les DM du bot sont interdits. Tapez \`${settings.prefix}dm true\` pour les autoriser.`)
        break
    }
}
module.exports.help = MESSAGES.Commandes.Utilitaires.DM;
