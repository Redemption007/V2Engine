const {MESSAGES} = require('../../starterpack/constants')
const {get} = require('axios')


module.exports.run = async (client, message, args) => {
    const user = await client.getUser(message.author)
    const club = args[0].replace(/^ *#?/, '') || user.profilBS.clubTag
    if (club && !club.match(/^\w+$/)) return message.reply('Le nom du club n\'est pas valide !')
    const clubBS = await get(`https://api.brawlstars.com/v1/clubs/%23${club}`)
    if (!clubBS ) return message.reply('Le nom du club n\'est pas valide !')
    return message.reply({embeds: [{title: `Club ${clubBS.name} (${clubBS.tag}) :`, description: `__Description :__\n> ${clubBS.description}\n__Trophées :__\n> ${clubBS.trophies}\n__Trophées resquis :__\n> ${clubBS.requiredTrophies}\n__Type :__\n> ${clubBS.type}`, color: 'GOLD', footer: {icon_url: message.author.displayAvatarURL(), text: `Club consulté par ${message.member.nickname||message.author.tag}`}}]})
}
module.exports.help = MESSAGES.Commandes.BrawlStars.CLUB;