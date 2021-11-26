const {MESSAGES} = require('../../starterpack/constants')
const {get} = require('axios')

module.exports.run = async (client, message, args) => {
    const guild = await client.getGuild(message.guild)
    const club = args[0].replace(/^ *#?/, '')
    console.log(club);
    if (!club) return message.reply('Merci de donner un tag de club !')
    if (!club.match(/^\w+$/)) return message.reply('Le tag du club n\'est pas valide !')
    const already = await guild.clubBS.find(cl => cl.tag === club)
    if (already) return message.reply('Merci d\'indiquer un tag club différent de ceux déjà donnés ! Regarde tous les clubs enregistrés avec la commande `clubs`')
    const clubBS = await get(`https://api.brawlstars.com/v1/clubs/%23${club}`, {headers: {"X-Requested-With": "XMLHttpRequest", "authorization": `Bearer ${client.config.BS_TOKEN}`}})
    if (!club.name) return message.reply('Le tag du club n\'est pas valide !')
    let clubs = guild.clubBS
    clubs.push({tag: club, name: clubBS.name})
    await client.updateGuild(message.guild, {clubBS: clubs})
    const role = await message.guild.roles.create({name: clubBS.name, color: 'GOLD', mentionable: true})
    return message.reply(`Le club Brawl Stars ${clubBS.name} (#${club}) a été enregistré avec succès. Le rôle créé est ${role}`)
}
module.exports.help = MESSAGES.Commandes.BrawlStars.ADDSERVERCLUB;