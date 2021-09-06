const {MESSAGES} = require('../../starterpack/constants')
const embed = require('../../commands/Utilitaires/embed')

module.exports.run = (client, message, args) => {
    embed.run(client, message, `BLUE;; Voici l'id/la version unicode de "${args[0]}" :;; \`${args[0]}\``)
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ID;
