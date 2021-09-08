const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = (_client, message, args) => {
    message.channel.send({embeds: [{color: "BLUE", title: `Voici l'id/la version unicode de "${args[0]}" :`, description: `\`${args[0]}\``}]})
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ID;
