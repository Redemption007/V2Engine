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
    if (role.permissions.has('ADMINISTRATOR')) return message.reply('Le rôle ne peut pas avoir la permission Administrateur activée !')
    const msg = await message.reply(`Êtes-vous sûr d'ajouter le rôle ${role} aux rôles d'animations ? Ceux-ci peuvent être ajoutés n'importe quand par des animateurs !`)
    msg.react('✅')
    msg.react('❌')
    const answer = await msg.awaitReactions({filter: filterReaction, time: 10000})
    msg.reactions.removeAll()
    if (!answer.size || answer.first()._emoji.name === '❌') {
        msg.edit('La commande est annulée').then(m => setTimeout(() => m.delete(), 5000))
        return
    }
    await guild.updateOne({$push: {roles: [args[0]]}})
    msg.edit(`Le rôle ${role} a été ajouté avec succès aux rôles d'animation !`)
}
module.exports.help = MESSAGES.Commandes.Animation.ADDROLE;
