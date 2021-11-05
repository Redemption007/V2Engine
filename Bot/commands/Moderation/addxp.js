const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args, settings) => {
    let member = message.mentions.members.first()
    let xp = +args[1]

    if (!member) { //Si aucun utilisateur n'est mentionné, alors l'utilisateur concerné est celui qui tape la commande
        member = await message.guild.members.fetch(message.author.id)
        xp = +args[0]
    }
    //On vérifie que pour chaque cas, xp est bien un nombre
    if (isNaN(xp)) return message.reply({embeds: [{color: 'RED', title: 'Oups !', description: `Voici la forme de la commande : ${settings.prefix}${MESSAGES.Commandes.Moderation.ADDXP.usage}`}]})

    const dbUserMentionned = await client.getUser(member)

    if (!dbUserMentionned) {
        await client.createUser({
            guildID: [member.guild.id],
            guildName: member.guild.name,
            userID: member.id,
            username: member.user.tag,
            xp: [xp]
        })

        return message.reply({embeds: [{color: 'BLUE', title: 'Ajout d\'xp réussi !', description: `Vous avez ajouté ${xp} points d'xp à <@${member.id}>.\nVoici son xp actuel : ${xp}`}]})
    }
    let index = await dbUserMentionned.guildIDs.indexOf(message.guild.id)
    if (index == -1) {
        index = await dbUserMentionned.guildIDs.length
        await client.updateUser(message.author, {$push: {guildIDs: message.guild.id, xp: 0, level: 0}})
    }
    await client.updateXP(member, message.guild.id, Math.abs(xp))

    return message.reply({embeds: [{color: 'BLUE', title: 'Ajout d\'xp réussi !', description: `Vous avez ajouté ${xp} points d'xp à <@${member.id}>.\nVoici son xp actuel : ${dbUserMentionned.xp[index]+xp}`}]})
}
module.exports.help = MESSAGES.Commandes.Moderation.ADDXP;
