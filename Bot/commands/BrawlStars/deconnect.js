const {MESSAGES} = require('../../starterpack/constants')
const {get} = require('axios')

module.exports.run = async (client, message, args) => {
    const user = await client.getUser(message.author)
    const guild = await client.getGuild(message.guild)
    const compte = args[0].replace(/^ *#?/, '')
    if (!user) return message.reply("Vous n'avez pas de profil utilisateur !")
    if (!compte) return message.reply('Merci de donner un tag de compte Brawl Stars !')
    if (!compte.match(/^\w+$/)) return message.reply('Le tag du compte Brawl Stars n\'est pas valide !')
    if (!user.comptes.length && !user.comptes.includes(compte)) return message.reply('Merci d\'indiquer un tag des comptes Brawl Stars déjà liés ! Regarde tous tes comptes liés avec la commande `comptes`')
    const compteBS = await get(`https://api.brawlstars.com/v1/players/%23${compte}`, {headers: {"authorization": `Bearer ${client.config.BS_TOKEN}`}})
    if (!compteBS) return message.reply('Le tag du compte n\'est pas valide !')
    let groups = user.comptes
    const index = groups.indexOf(compte)
    groups.splice(index, 1)
    await client.updateUser(message.author, {comptes: groups})
    if (guild.clubBS.find(cl => cl.name === compteBS.data.club.name)) {
        await client.emit('updateClubMember', guild, compteBS, groups, message, message.author)
    }
    return message.reply(`Le compte Brawl Stars **${compteBS.data.name}** a été supprimé avec succès.`)
}
module.exports.help = MESSAGES.Commandes.BrawlStars.DECONNECT;