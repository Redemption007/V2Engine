const {MESSAGES} = require('../../starterpack/constants')
const {get} = require('axios')

module.exports.run = async (client, message) => {
    const guild = await client.getGuild(message.guild)
    if (!guild.clubBS.length) return message.reply("Il n'y a aucun club BS lié à ce serveur !")
    let description = ""
    for (let i=0; i<guild.clubBS.length; i++) {
        const club = await get(`https://api.brawlstars.com/v1/clubs/%23${guild.clubBS[i]}`, {headers: {"authorization": `Bearer ${client.config.BS_TOKEN}`}})
        description += `__Club n°${i+1} :__ ${club.name} (#${guild.clubBS[i]})`
    }
    return message.reply({embeds: [{title: 'Liste des clubs liés au serveur :', description: description, color: 'GOLD', footer: {icon_url: message.author.displayAvatarURL(), text: `Liste consultée par ${message.member.nickname||message.author.tag}`}}]})
}
module.exports.help = MESSAGES.Commandes.BrawlStars.CLUBS;