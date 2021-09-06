const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {
    const filterLinkOrID = msg => msg.match(/(https:\/\/)?(www\.)?(ptb\.|canary\.)?(discord\.com\/channels\/([0-9]{18}\/){2})?[0-9]{18}/)
    await message.reply('quel est l\'ID ou lien lien du message ?')
    await message.channel.awaitMessages(filterLinkOrID, {max: 1, time: 30000})
        .then()
}
module.exports.help = MESSAGES.Commandes.Utilitaires.CHANGEREACTOR;