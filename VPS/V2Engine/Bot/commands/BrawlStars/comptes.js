const {MESSAGES} = require('../../starterpack/constants')
const {MessageEmbed} = require('discord.js')
const {get} = require('axios')

module.exports.run = async (client, message, args) => {
    let utilisateur = {}
    if (message.mentions.members.size) utilisateur = message.mentions.users.first()
    else if (args.length) {
        const userExists = message.guild.members.fetch(args[0]).catch()
        if (!args[0].isNaN() && userExists) utilisateur = {id: args[0]}
    }
    else utilisateur = message.author
    const user = await client.getUser(utilisateur)
    if (!user.comptes.length) return message.reply("Il n'y a aucun compte Brawl Stars lié à cet utilisateur !")
    let embed = new MessageEmbed({
        title: `Liste des comptes liés à l'utilisateur ${user.username} :`,
        color: 'GOLD',
        footer: {icon_url: message.author.displayAvatarURL(), text: `Liste consultée par ${message.member.nickname||message.author.tag}`}
    })
    for (let i=0; i<user.comptes.length; i++) {
        const compte = await get(`https://api.brawlstars.com/v1/players/%23${user.comptes[i]}`, {headers: {"authorization": `Bearer ${client.config.BS_TOKEN}`}})
        embed.addField(`__Compte n°${i+1} :__`, `**${compte.data.name}** (#${user.comptes[i]})\nTrophées : ***${compte.data.trophies}***\n> Club : **${compte.data.club.name}**`)
    }
    return message.reply({embeds: [embed]})
}
module.exports.help = MESSAGES.Commandes.BrawlStars.COMPTES;