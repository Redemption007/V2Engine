const {MESSAGES} = require('../../starterpack/constants')
const ms = require('../../util/ms')

module.exports.run = async (client, message, args) => {
    if (args.length<2) return message.reply('Merci d\'indiquer un groupe et une durée valides.')
    const guild = await client.getGuild(message.guild)
    const duration = args.pop()
    const groupe = args.join(' ')
    if (groupe.match(/^\d+$/)) return message.reply('Le nom du groupe ne peut pas être une séquence de chiffres ! Regarde tous les groupes possibles avec la commande `groups`')
    const hasPermissions = (member, group) => {
        let has = 0
        group.roles.forEach(r => {
            if (member.roles.cache.get(r)) has++
        })
        if (has) return true
        return false
    }
    const duree = ms(duration)
    const group = guild.groups.find(gr => gr.name.toLowerCase() === groupe.toLowerCase())
    if (!group) return message.reply('Merci d\'indiquer un groupe valide ! Regarde tous les groupes possibles avec la commande `groups`')
    if (!hasPermissions(message.member, group)) return message.reply("Vous n'êtes pas dans ce groupe.")
    if (!duree) return message.reply('Merci d\'indiquer une durée valide ! Exemples : `23h`, `2 semaines`, 8 jours')
    await client.updateAbsences(message.guild, message.author.id, groupe, Date.now()+duree)
    client.clock(async (ID, grp, msg) => {
        await client.updateAbsences(msg.guild, ID, grp)
        return msg.reply('Ton retour a été enregistré avec succès ! Bon retour parmis nous ^^')
    }, duree, message.author.id, groupe, message)
    return message.reply('Ton absence a été annoncée avec succès ! Tu seras noté de retour automatiquement dans '+ms(duree, true))
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ABSENT;
