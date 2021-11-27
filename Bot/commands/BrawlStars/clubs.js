const {MESSAGES} = require('../../starterpack/constants')
const {MessageEmbed} = require('discord.js')
const {get} = require('axios')

module.exports.run = async (client, message) => {
    const guild = await client.getGuild(message.guild)
    if (!guild.clubBS.length) return message.reply("Il n'y a aucun club BS lié à ce serveur !")
    let embed = new MessageEmbed({
        title: 'Liste des clubs liés au serveur :',
        color: 'GOLD',
        footer: {icon_url: message.author.displayAvatarURL(), text: `Liste consultée par ${message.member.nickname||message.author.tag}`}
    })
    for (let i=0; i<guild.clubBS.length; i++) {
        const club = await get(`https://api.brawlstars.com/v1/clubs/%23${guild.clubBS[i].tag}`, {headers: {"authorization": `Bearer ${client.config.BS_TOKEN}`}})
        embed.addField(`__Club n°${i+1} :__`, `**${club.data.name}** (#${guild.clubBS[i].tag})`, true)
    }
    return message.reply({embeds: [embed]})
}
module.exports.help = MESSAGES.Commandes.BrawlStars.CLUBS;