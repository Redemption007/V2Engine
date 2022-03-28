const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = (client, message, args) => {
    message.channel.send(args.join(" "))
}
module.exports.help = MESSAGES.Commandes.Utilitaires.SAY;
