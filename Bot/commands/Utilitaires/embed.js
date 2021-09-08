/* eslint-disable valid-typeof */

const Discord = require('discord.js')
const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = (client, message, args) => {
    if (typeof args === 'array') args.join(' ')
    const arg = args.split(';; ')
    const embed = new Discord.MessageEmbed()
        .setColor(`${arg.shift()}`)
        .setTitle(`${arg.shift()}`)
        .setTimestamp()
        .setDescription(`${arg.join(" ")}`)

    try {
        embed.setFooter(`Intégration écrite par ${message.author.username}`, message.author.displayAvatarURL())
    } catch (e) {
        return message.send({embeds: [embed]})
    }

    return message.channel.send({embeds: [embed]})
}
module.exports.help = MESSAGES.Commandes.Utilitaires.EMBED;

/*
Envoyer une intégration avec tous les paramètres possibles.
Possibilité d'éditer un embed déjà envoyé.
Doit prendre en compte les réponses de l'utilisateur pour la personnalisation de l'embed.
Pour ça, envoi de plusieurs embeds demandant des précisions sur la personnalistaion.
*/
