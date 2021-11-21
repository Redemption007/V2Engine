const {MESSAGES} = require('../../starterpack/constants')
const fetch = require('node-fetch')

module.exports.run = async (client, message, args) => {
    const guild = await client.getGuild(message.guild)
    const club = args[0].replace(/^ ?#/, '')
    if (!club) return message.reply('Merci de donner un tag de club !')
    if (!club.match(/^#\w+$/)) return message.reply('Le tag du club n\'est pas valide !')
    if (guild.clubs.includes(club)) return message.reply('Merci d\'indiquer un tag club différent de ceux déjà donnés ! Regarde tous les clubs enregistrés avec la commande `clubs`')
    const clubBS = await fetch(`https://api.brawlstars.com/v1/clubs/%23${club}`)
    if (!club.name) return message.reply('Le tag du club n\'est pas valide !')
    let clubs = guild.clubBS
    clubs.push(club)
    await client.updateGuild(message.guild, {clubBS: clubs})
    return message.reply(`Le club Brawl Stars ${clubBS.name} (#${club}) a été enregistré avec succès.`)
}
module.exports.help = MESSAGES.Commandes.BrawlStars.ADDSERVERCLUB;