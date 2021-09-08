const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = (_client, message, args) => {
    message.channel.send({embeds: [{color: "BLUE", description: `Voici l'id/la version unicode de "${args[0]}" :\n\n\`${args[0]}\``}]})
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ID;
