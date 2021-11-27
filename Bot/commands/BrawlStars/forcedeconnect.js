const {MESSAGES} = require('../../starterpack/constants')
const {get} = require('axios')

module.exports.run = async (client, message, args) => {
    let utilisateur = {}
    if (message.mentions.members.size) utilisateur = message.mentions.users.first()
    else {
        const userExists = message.guild.members.fetch(args[0]).catch()
        if (!args[0].isNaN() && userExists) utilisateur = {id: args[0]}
        else utilisateur = message.author
    }
    const user = await client.getUser(utilisateur)
    const guild = await client.getGuild(message.guild)
    const compte = args[1].replace(/^ *#?/, '')
    if (!user) return message.reply("L'utilisateur saisi n'est pas valide ou n'a pas de profil utilisateur !")
    if (!compte) return message.reply('Merci de donner un tag de compte Brawl Stars !')
    if (!compte.match(/^\w+$/)) return message.reply('Le tag du compte Brawl Stars n\'est pas valide !')
    if (!user.comptes.length && !user.comptes.includes(compte)) return message.reply('Merci d\'indiquer un tag des comptes Brawl Stars déjà liés à l\'utilisateur ! Regarde tous ses comptes liés avec la commande `comptes [@user ou user_ID]`')
    const compteBS = await get(`https://api.brawlstars.com/v1/players/%23${compte}`, {headers: {"authorization": `Bearer ${client.config.BS_TOKEN}`}})
    if (!compteBS) return message.reply('Le tag du compte n\'est pas valide !')
    let groups = user.comptes
    const index = groups.indexOf(compte)
    groups.splice(index, 1)
    await client.updateUser(message.author, {comptes: groups})
    let desc = ''
    if (guild.clubBS.find(cl => cl.name === compteBS.data.club.name)) {
        let still = 0
        for (let i=0; i<groups.length; i++) {
            const autre_compte = await get(`https://api.brawlstars.com/v1/players/%23${groups[i]}`, {headers: {"authorization": `Bearer ${client.config.BS_TOKEN}`}})
            if (guild.clubBS.find(cl => cl.name === autre_compte.data.club.name)) still++
        }
        const role = await message.guild.roles.cache.find(r => r.name === compteBS.data.club.name)
        if (role && !still) {
            await message.member.roles.remove(role.id).catch()
            desc = `Le rôle **${role.name}** lui a bien été enlevé.`
        }
    }
    return message.reply(`Le compte Brawl Stars **${compteBS.data.name}** a été supprimé avec succès des comptes liés de <@${utilisateur.id}>.`+desc)
}
module.exports.help = MESSAGES.Commandes.BrawlStars.FORCEDECONNECT;