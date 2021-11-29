const {MESSAGES} = require('../../starterpack/constants')
const ms = require('../../util/ms')

module.exports.run = async (client, message, args) => {
    const guild = await client.getGuild(message.guild)
    const groupe = args.join(' ')
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    let description = ''
    if (!groupe) {
        const user_absences = await guild.absences.filter(ele => ele.userID === message.author.id)
        if (!user_absences.length) return message.reply("Vous n'avez pas d'absences enregistrées.")
        for (let i=0; i<user_absences.length; i++) {
            const date = new Date(user_absences[i].duree)
            let dates = date.toLocaleTimeString('fr-FR', options).split(',')
            description+= `Absent du groupe **${user_absences[i].group}** jusqu'au ${dates[0]} à ${dates[1]} (dans ${ms(date-Date.now(), true)})\n`
        }
        return message.reply({embeds: [{title: 'Vos absences :', color: 'WHITE', description: description, footer: {icon_url: message.author.displayAvatarURL(), text: `Absences de ${message.member.nickname||message.author.tag}`}}]})
    }
    const hasPermissions = (member, group) => {
        let has = 0
        group.roles.forEach(r => {
            if (member.roles.cache.get(r)) has++
        })
        if (has) return true
        return false
    }
    const isIn = guild.groups.find(gr => gr.name.toLowerCase() === groupe.toLowerCase())
    if (!isIn) return message.reply('Merci d\'indiquer un groupe valide ! Regarde tous les groupes possibles avec la commande `groups`')
    if (!hasPermissions(message.member, isIn)) return message.reply("Vous n'avez pas les permissions pour regarder les absences de ce groupe.")
    const group_absences = await guild.absences.filter(ele => ele.group === groupe)
    if (!group_absences.length) return message.reply("Ce groupe n'a pas d'absences enregistrées.")
    for (let i=0; i<group_absences.length; i++) {
        const date = new Date(group_absences[i].duree)
        let dates = date.toLocaleTimeString('fr-FR', options).split(',')
        description+= `<@${group_absences[i].userID}> est absent jusqu'au ${dates[0]} à ${dates[1]} (dans ${ms(date-Date.now(), true)})\n`
    }
    return message.reply({embeds: [{title: `Absences du groupe **${groupe}** :`, color: 'WHITE', description: description, footer: {icon_url: message.author.displayAvatarURL(), text: `Absences consultées par ${message.member.nickname||message.author.tag}`}}]})
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ABSENCES;