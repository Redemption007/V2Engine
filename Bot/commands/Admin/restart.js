const embed = require('../Utilitaires/embed')

const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {
    if (!client.config.OWNERS_ID.includes(message.author.id)) return message.reply("seul les owners du bot peuvent éxécuter cette commande !");
    await embed.run(client, client.channels.cache.get(client.config.CHANNELLOGID), 'GOLD;; Veuillez patienter;; Le bot redémarre...')
    process.exit()
}
module.exports.help = MESSAGES.Commandes.Admin.RESTART;
