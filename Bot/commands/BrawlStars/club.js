const {MESSAGES} = require('../../starterpack/constants')
const {get} = require('axios')


module.exports.run = async (client, message, args) => {
    const club = args[0].replace(/^ *#?/, '')
    if (club && !club.match(/^\w+$/)) return message.reply('Le nom du club n\'est pas valide !')
    const clubBS = await get(`https://api.brawlstars.com/v1/clubs/%23${club}`, {headers: {"authorization": `Bearer ${client.config.BS_TOKEN}`}})
    if (!clubBS) return message.reply('Le nom du club n\'est pas valide !')
    return message.reply({embeds: [{title: `Club ${clubBS.data.name} (${clubBS.data.tag}) :`, description: `__**Description :**__\n> ${clubBS.data.description}\n__**Trophées** :__\n> ${clubBS.data.trophies}\n__**Trophées requis :**__\n> ${clubBS.data.requiredTrophies}\n__**Type :**__\n> ${clubBS.data.type}`, color: 'GOLD', footer: {icon_url: message.author.displayAvatarURL(), text: `Club consulté par ${message.member.nickname||message.author.tag}`}}]})
}
module.exports.help = MESSAGES.Commandes.BrawlStars.CLUB;