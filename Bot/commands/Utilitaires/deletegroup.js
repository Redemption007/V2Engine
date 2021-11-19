const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    const guild = await client.getGuild(message.guild)
    const groupe = args[0]
    if (!groupe) return message.reply('Merci de donner un nom de groupe !')
    if (!guild.groups.includes(groupe)) return message.reply('Merci d\'indiquer un nom groupe enregistré de ceux déjà donnés ! Regarde tous les groupes enregistrés avec la commande `groups`')
    let groups = guild.groups
    groups.splice(groups.indexOf(groupe), 1)
    await client.updateGuild(message.guild, {groups: groups})
    return message.reply("Le groupe a été supprimé avec succès.")
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ADDGROUP;