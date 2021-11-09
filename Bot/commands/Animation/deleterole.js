const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    const guild = await client.getGuild(message.guild)
    const filterReaction = reac => reac.users.cache.get(message.author.id) && ['✅', '❌'].includes(reac._emoji.name)
    let role
    if (args[0].match(/^[0-9]{18}$/)) {
        role = await message.guild.roles.fetch(args[0])
        if (!role) return message.reply('Ce rôle n\'existe pas !')
    } else {
        if (!message.mentions.roles.size) return message.reply('Il vous faut mettre un ID ou mentionner un rôle !')
        role = message.mentions.roles.first()
    }
    const index_role = guild.roles.indexOf(role.id)
    if (!index_role) return message.reply('Ce rôle n\'est pas dans les rôles d\'animation !')
    const msg = await message.reply(`Êtes-vous sûr de supprimer le rôle ${role} aux rôles d'animations ? Les animateurs ne pourront plus ajouter ce rôle s'ils n'ont pas la permission de gérer les rôles !`)
    msg.react('✅')
    msg.react('❌')
    const answer = await msg.awaitReactions({filter: filterReaction, time: 10000})
    msg.reactions.removeAll()
    if (!answer.size || answer.first()._emoji.name === '❌') {
        msg.edit('La commande est annulée').then(m => setTimeout(() => m.delete(), 5000))
        return
    }
    let Roles = guild.roles
    Roles.splice(index_role, 1)
    client.updateGuild(message.guild, {roles: Roles})
    msg.edit(`Le rôle ${role} a été supprimé avec succès des rôles d'animation !`)
}
module.exports.help = MESSAGES.Commandes.Animation.DELETEROLE;
