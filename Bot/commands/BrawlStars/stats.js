/* eslint-disable no-unused-vars */
const fetch = require('node-fetch')
const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = (_client, message, _args) => {
    return message.reply("Commande non disponible.")
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ADDGROUP;