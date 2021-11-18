const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    const guild = await client.getGuild(message.guild)
    const groupe = args[0]
    if (!guild.groups.include(groupe)) return message.reply('Merci d\'entrer un groupe valide ! Regarde tous les groupes possibles avec la commande `groups`')
    const user = guild.absences.find(obj => obj.group === groupe && obj.userID === message.author.id)
    if (!user) return message.reply("Tu n'étais pas enregistré comme absent dans ce groupe ! Gère tes absences avec la commande `absences`")
    await client.updateAbsences(message.guild, message.author.id, groupe)
    return message.reply('Ton retour a été enregistré avec succès ! Bon retour parmis nous ^^')
}
module.exports.help = MESSAGES.Commandes.Utilitaires.DERETOUR;
