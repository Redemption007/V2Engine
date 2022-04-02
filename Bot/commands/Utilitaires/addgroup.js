const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {
    const guild = await client.getGuild(message.guild)
    let groupe = []
    let roles = []
    const filterGroup = async msg => {
        if (msg.author.id !== message.author.id) return false
        const already = await guild.groups.find(ele => ele.name.toLowerCase() === msg.content.toLowerCase())
        if (already) message.reply('Merci d\'indiquer un nom de groupe différent de ceux déjà donnés ! Regarde tous les groupes enregistrés avec la commande `groups`')
        if (msg.content.match(/^\d+$/)) message.reply('Le nom du groupe ne peut pas être une séquence de chiffres ! Regarde tous les groupes possibles avec la commande `groups`')
        return !msg.content.match(/^\d+$/) && !already
    }
    const filterRoles = msg => msg.author.id === message.author.id && (msg.content.match(/^non\.?$/i) || msg.mentions.roles.size)
    await message.channel.send("Merci de donner un nom de groupe :")
    await message.channel.awaitMessages({filter: filterGroup, max: 1}).then(coll => groupe = coll.first().content)
    await message.channel.send("Ce groupe sera-t-il réservé à un ou plusieurs rôle ? Si non, marquez `Non`. Si oui, mentionnez tous les rôles concernés.")
    await message.channel.awaitMessages({filter: filterRoles, max: 1}).then(coll => {
        if (coll.first().content.match(/^non\.?$/i)) return
        for (let i=0; i<coll.first().mentions.roles.size; i++) {
            roles.push(coll.first().mentions.roles.at(i).id)
        }
    })

    let groups = guild.groups
    groups.push({name: groupe, roles: roles})
    await client.updateGuild(message.guild, {groups: groups})
    return message.reply("Le groupe a été enregistré avec succès.")
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ADDGROUP;