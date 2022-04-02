/* eslint-disable no-unused-vars */
const {get} = require('axios')
const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = (_client, message, _args) => {
    return message.reply("Commande non disponible.")
}
module.exports.help = MESSAGES.Commandes.BrawlStars.BSSTATS;