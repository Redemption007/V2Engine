const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {
    if (!client.config.OWNERS_ID.includes(message.author.id)) return message.reply("Seuls les owners du bot peuvent exécuter cette commande !");
    await client.channels.cache.get(client.config.CHANNELLOGID).send({embeds: [{description: 'Veuillez patienter, le bot redémarre...', color: 'GOLD'}]})
    process.exit()
}
module.exports.help = MESSAGES.Commandes.Admin.RESTART;
