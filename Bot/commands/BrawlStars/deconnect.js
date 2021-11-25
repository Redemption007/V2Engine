const {MESSAGES} = require('../../starterpack/constants')
const {get} = require('axios')

module.exports.run = async (client, message, args) => {
    const user = await client.getUser(message.author)
    const guild = await client.getGuild(message.guild)
    const compte = args[0].replace(/^ *#?/, '')
    if (!compte) return message.reply('Merci de donner un tag de compte Brawl Stars !')
    if (!compte.match(/^\w+$/)) return message.reply('Le tag du compte Brawl Stars n\'est pas valide !')
    if (user.comptes.length && !user.comptes.includes(compte)) return message.reply('Merci d\'indiquer un tag des comptes Brawl Stars déjà liés ! Regarde tous tes comptes liés avec la commande `comptes`')
    const compteBS = await get(`https://api.brawlstars.com/v1/players/%23${compte}`)
    if (!compteBS) return message.reply('Le tag du compte n\'est pas valide !')
    let groups = user.comptes
    const index = groups.indexOf(compte)
    groups.splice(index, 1)
    await client.updateUser(message.author, {comptes: groups})
    let desc = ''
    if (guild.clubBS.length && guild.clubBS.includes(compteBS.club.tag.replace(/ ?#/, ''))) {
        let still = 0
        for (let i=0; i<groups.length; i++) {
            const autre_compte = await get(`https://api.brawlstars.com/v1/players/%23${groups[i]}`)
            if (guild.clubBS.includes(autre_compte.club.tag.replace(/^ ?#/, ''))) still++
        }
        const role = await message.guild.roles.cache.find(r => r.name === compteBS.club.name)
        if (role && !still) {
            await message.member.roles.remove(role.id)
            desc = `Le rôle **${role.name}** vous a bien été enlevé.`
        }
    }
    return message.reply(`Le compte Brawl Stars **${compteBS.name}** a été supprimé avec succès.`+desc)
}
module.exports.help = MESSAGES.Commandes.BrawlStars.DECONNECT;