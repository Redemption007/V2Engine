const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {
    const guild = await client.getGuild(message.guild)
    if (!guild.roles.length) return message.reply("Il n'y a aucun rôle enregistré pour les animations ! Faites `addrole <@role ou role_ID>` pour en ajouter un.")
    let role_list = ''
    for (let i=0; i<guild.roles.length; i++) {
        role_list += i+'- <@&'+guild.roles[i]+'>'
    }
    return message.reply({embeds: [{title: "Liste des rôles d'animation", color: 'BLUE', fields: [{name: 'ID - Role', value: role_list}], footer: {text: `Liste demandée par ${message.member.nickname||message.author.tag}`, icon_url: message.author.displayAvatarURL()}}]})
}
module.exports.help = MESSAGES.Commandes.Animation.ROLELIST;
