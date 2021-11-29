const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    const guild = await client.getGuild(message.guild)
    const groupe = args.join(' ')
    if (!groupe) return message.reply('Merci de donner un nom de groupe !')
    const group = guild.groups.find(gr => gr.name.toLowerCase() === groupe.toLowerCase())
    if (!group) return message.reply('Merci d\'indiquer un nom de groupe déjà enregistré ! Regarde tous les groupes enregistrés avec la commande `groups`')
    let groups = guild.groups
    groups.splice(groups.findIndex(gr => gr.name.toLowerCase() === groupe.toLowerCase()), 1)
    await client.updateGuild(message.guild, {groups: groups})
    return message.reply("Le groupe a été supprimé avec succès.")
}
module.exports.help = MESSAGES.Commandes.Utilitaires.DELETEGROUP;