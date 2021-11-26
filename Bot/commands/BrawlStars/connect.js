const {MESSAGES} = require('../../starterpack/constants')
const {get} = require('axios')

module.exports.run = async (client, message, args) => {
    const user = await client.getUser(message.author)
    const guild = await client.getGuild(message.guild)
    const compte = args[0].replace(/^ *#?/, '')
    if (!compte) return message.reply('Merci de donner un tag de compte Brawl Stars !')
    if (!compte.match(/^\w+$/)) return message.reply('Le tag du compte Brawl Stars n\'est pas valide !')
    if (user.comptes.length && user.comptes.includes(compte)) return message.reply('Merci d\'indiquer un tag de compte Brawl Stars différent de ceux déjà donnés ! Regarde tous tes comptes liés avec la commande `comptes`')
    const compteBS = await get(`https://api.brawlstars.com/v1/players/%23${compte}`, {headers: {"authorization": `Bearer ${client.config.BS_TOKEN}`}})
    if (!compteBS) return message.reply('Le tag du compte n\'est pas valide !')
    let groups = user.comptes
    groups.push(compte)
    await client.updateUser(message.author, {comptes: groups})
    let desc = ''
    if (guild.clubBS.length && guild.clubBS.includes(compteBS.club.tag.replace(/ ?#/, ''))) {
        const role = await message.guild.roles.cache.find(r => r.name === compteBS.club.name)
        if (role) {
            await message.member.roles.add(role.id)
            desc = `Le rôle **${role.name}** vous a donc bien été attribué.`
        }
    }
    return message.reply(`Le compte Brawl Stars **${compteBS.name}** a été lié avec succès.`+desc)
}
module.exports.help = MESSAGES.Commandes.BrawlStars.CONNECT;