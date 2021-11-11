const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args, settings) => {
    const filterReaction = reac => reac.users.cache.get(message.author.id) && ['✅', '❌'].includes(reac._emoji.name)
    let member
    if (args[0].match(/^[0-9]{18}$/)) {
        member = await message.guild.members.fetch(args[0])
        if (!member) return message.reply('Ce membre n\'existe pas !')
    } else {
        if (!message.mentions.members.size) return message.reply('Il vous faut mettre un ID ou mentionner un membre !')
        member = message.mentions.members.first()
    }
    const role_to_remove = settings.roles[args[1]]
    if (!role_to_remove) return message.reply('Cet id de rôle n\'existe pas ! Faites `rolelist` pour voir la liste des rôles d\'animation enregistrés.')
    if (!member.roles.cache.has(role_to_remove)) return message.reply({embeds: [{color: 'RED', description: `${member} ne possède pas le rôle <@&${role_to_remove}> !`}]})
    const msg = await message.reply({embeds: [{color: 'ORANGE', description: `Êtes-vous sûr de retirer le rôle <@&${role_to_remove}> à ${member} ?`}]})
    msg.react('✅')
    msg.react('❌')
    const answer = await msg.awaitReactions({filter: filterReaction, idle: 10000, max: 1})
    msg.reactions.removeAll()
    if (!answer.size || answer.first()._emoji.name === '❌') {
        return msg.edit('La commande est annulée.')
    }
    await member.roles.remove(role_to_remove)
    return msg.edit({embeds: [{color: 'ORANGE', description: `Le rôle <@&${role_to_remove}> a correctement été enlevé à ${member}.`}]})
}
module.exports.help = MESSAGES.Commandes.Animation.REMOVEROLE;
