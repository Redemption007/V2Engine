const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {
    const guild = await client.getGuild(message.guild)
    let description = ''
    if (!guild.groups.length) return message.reply("Il n'y a actuellement aucun groupe enregistré sur ce serveur ! Faites la commande `addgroup` pour en ajouter !")
    guild.groups.forEach(element => {
        description+= `- **${element.name}** ${element.roles.length? `(<@&${element.roles.join('>, <@')}> seulement)`:''}\n`
    })
    return message.reply({embeds: [{title: `Groupes :`, color: 'WHITE', description: description, footer: {icon_url: message.author.displayAvatarURL(), text: `Groupes consultés par ${message.member.nickname||message.author.tag}`}}]})
}
module.exports.help = MESSAGES.Commandes.Utilitaires.GROUPS;
