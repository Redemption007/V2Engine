const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    const guild = await client.getGuild(message.guild)
    const groupe = args[0]
    if (!groupe) return message.reply('Merci de donner un nom de groupe !')
    if (groupe.match(/^\d+$/)) return message.reply('Le nom du groupe ne peut pas être une séquence de chiffres ! Regarde tous les groupes possibles avec la commande `groups`')
    if (guild.groups.includes(groupe)) return message.reply('Merci d\'indiquer un nom de groupe différent de ceux déjà donnés ! Regarde tous les groupes enregistrés avec la commande `groups`')
    let groups = guild.groups
    groups.push(groupe)
    await client.updateGuild(message.guild, {groups: groups})
    return message.reply("Le groupe a été enregistré avec succès.")
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ADDGROUP;