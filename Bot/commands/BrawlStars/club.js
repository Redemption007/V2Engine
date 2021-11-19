const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    const guild = await client.getGuild(message.guild)
    const club = args[0]
    if (!club) return message.reply('Merci de donner un nom de club !')
    if (!club.match(/^#\w+$/)) return message.reply('Le nom du club n\'est pas valide !')
    if (guild.groups.includes(club)) return message.reply('Merci d\'indiquer un nom club différent de ceux déjà donnés ! Regarde tous les clubs enregistrés avec la commande `groups`')
    let groups = guild.groups
    groups.push(club)
    await client.updateGuild(message.guild, {groups: groups})
    return message.reply("Le groupe a été enregistré avec succès.")
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ADDGROUP;