const embed = require('../Utilitaires/embed')

const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {
    if (message.author.id !== "554344205405650957" && message.author.id !=="781109649730043965") return message.reply("seul l'owner du bot peut éxécuter cette commande !");
    await embed.run(client, client.channels.cache.get('793864621374308372'), 'GOLD;; Veuillez patienter;; Le bot redémarre...')
    process.exit()
}
module.exports.help = MESSAGES.Commandes.Admin.RESTART;
