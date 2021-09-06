const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = (client, message, args) => {
    console.log(args)
    message.channel.send(args.join(" "))
}
module.exports.help = MESSAGES.Commandes.Utilitaires.SAY;
