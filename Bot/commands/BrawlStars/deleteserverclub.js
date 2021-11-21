const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    const guild = await client.getGuild(message.guild)
    const club = args[0]
    if (!club) return message.reply('Merci de donner un nom de club !')
    if (!guild.clubs.includes(club)) return message.reply('Merci d\'indiquer un nom club enregistré ! Regarde la liste avec la commande `clubs`')
    let clubs = guild.clubBS
    const index = clubs.indexOf(club)
    clubs.splice(index, 1)
    await client.updateGuild(message.guild, {clubBS: clubs})
    return message.reply("Le club Brawl Stars a été supprimé avec succès.")
}
module.exports.help = MESSAGES.Commandes.BrawlStars.DELETESERVERCLUB;