const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (_client, message) => {
    const newchannel = await message.channel.clone({reason: "Nuke du channel 1/2"})
    newchannel.setPosition(message.channel.position)
    message.channel.delete('Nuke du channel 2/2')
}
module.exports.help = MESSAGES.Commandes.Utilitaires.NUKE;
