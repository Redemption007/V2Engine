const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    const guild = await client.getGuild(message.guild)
    const groupe = args[0]
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    let description = ''
    if (!groupe) {
        const user_absences = await guild.absences.find(ele => ele.userID === message.author.id)
        for (let i=0; i<user_absences.length; i++) {
            const date = new Date(user_absences[i].duree)
            description+= `Absent du groupe **${user_absences[i].group}** jusqu'au ${date.toLocaleDateString('fr-FR', options)} à ${date.toLocaleTimeString('fr-FR', options)}\n`
        }
        return message.reply({embeds: [{title: 'Vos absences :', color: 'WHITE', description: description, footer: {icon_url: message.author.displayAvatarURL(), text: `Absences de ${message.member.nickname||message.author.tag}`}}]})
    }
    if (!guild.groups.includes(groupe)) return message.reply('Merci d\'indiquer un groupe valide ! Regarde tous les groupes possibles avec la commande `groups`')
    const group_absences = await guild.absences.find(ele => ele.group === groupe)
    for (let i=0; i<group_absences.length; i++) {
        const date = new Date(group_absences[i].duree)
        description+= `<@${group_absences[i].userID}> est absent jusqu'au ${date.toLocaleDateString('fr-FR', options)} à ${date.toLocaleTimeString('fr-FR', options)}\n`
    }
    return message.reply({embeds: [{title: `Absences du groupe **${groupe}** :`, color: 'WHITE', description: description, footer: {icon_url: message.author.displayAvatarURL(), text: `Absences consultées par ${message.member.nickname||message.author.tag}`}}]})
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ABSENCES;