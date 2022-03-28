const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    const guild = await client.getGuild(message.guild)
    const club = args[0].replace(/^ *#?/, '')
    if (!club) return message.reply('Merci de donner un nom de club !')
    const already = await guild.clubBS.find(cl => cl.tag === club)
    if (!already) return message.reply('Merci d\'indiquer un nom de club pré-enregistré ! Regarde la liste avec la commande `clubs`')
    let clubs = guild.clubBS
    const index = clubs.indexOf(already)
    clubs.splice(index, 1)
    const role = await message.guild.roles.cache.find(r => r.name === already.name)
    if (role) role.delete()
    await client.updateGuild(message.guild, {clubBS: clubs})
    return message.reply("Le club Brawl Stars a été supprimé avec succès, ainsi que son rôle.")
}
module.exports.help = MESSAGES.Commandes.BrawlStars.DELETESERVERCLUB;