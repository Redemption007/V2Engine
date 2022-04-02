const {MESSAGES} = require('../../starterpack/constants')
const {get} = require('axios')

module.exports.run = async (client, message, args) => {
    let utilisateur = {}
    let compte = ''
    if (message.mentions.members.size) {
        utilisateur = message.mentions.members.first()
        compte = args[1].replace(/^ *#?/, '')
    }
    else if (!args[0].match(/^ *#/)){
        const userExists = await message.guild.members.fetch(args[0]).catch()
        if (!isNaN(args[0]) && userExists) {
            utilisateur = userExists
            compte = args[1].replace(/^ *#?/, '')
        }
    }
    else {
        utilisateur = message.author
        compte = args[0].replace(/^ *#?/, '')
    }
    const user = await client.getUser(utilisateur)
    const guild = await client.getGuild(message.guild)
    if (!user) return message.reply("L'utilisateur saisi n'est pas valide ou n'a pas de profil utilisateur !")
    if (!compte) return message.reply('Merci de donner un tag de compte Brawl Stars !')
    if (!compte.match(/^\w+$/)) return message.reply('Le tag du compte Brawl Stars n\'est pas valide !')
    if (!user.comptes.length && !user.comptes.includes(compte)) return message.reply('Merci d\'indiquer un tag des comptes Brawl Stars déjà liés à l\'utilisateur ! Regarde tous ses comptes liés avec la commande `comptes [@user ou user_ID]`')
    const compteBS = await get(`https://api.brawlstars.com/v1/players/%23${compte}`, {headers: {"authorization": `Bearer ${client.config.BS_TOKEN}`}})
    if (!compteBS) return message.reply('Le tag du compte n\'est pas valide !')
    let groups = user.comptes
    const index = groups.indexOf(compte)
    groups.splice(index, 1)
    await client.updateUser(utilisateur, {comptes: groups})
    /*
    IDEE :
    Faire un événement personnalisé que j'appelle dans les commandes deconnect, force deconnect et stats
    Ainsi, si le mec se barre du club avec son compte, la prochaine fois que qqun regarde son compte, le rôle lui sera enlevé
    Je peux aussi l'appeler en boucle dans la commande club, pour vérifier tous les membres du clan d'un coup. Il faudra simplement penser
    */
    if (guild.clubBS.find(cl => cl.name === compteBS.data.club.name)) {
        client.emit('updateClubMember', guild, compteBS, groups, message, utilisateur)
    }
    return message.reply(`Le compte Brawl Stars **${compteBS.data.name}** a été supprimé avec succès des comptes liés de <@${utilisateur.id}>.`)
}
module.exports.help = MESSAGES.Commandes.BrawlStars.FORCEDECONNECT;