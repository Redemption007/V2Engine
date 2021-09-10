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
            guildID: member.guild.id,
            guildName: member.guild.name,
            userID: member.id,
            username: member.user.tag,
            xp: xp
        })

        return message.reply({embeds: [{color: 'BLUE', title: 'Ajout d\'xp réussi !', description: `Vous avez ajouté ${xp} points d'xp à <@${member.id}>.\nVoici son xp actuel : ${xp}`}]})
    }
    await client.updateXP(member, xp)

    return message.reply({embeds: [{color: 'BLUE', title: 'Ajout d\'xp réussi !', description: `Vous avez ajouté ${xp} points d'xp à <@${member.id}>.\nVoici son xp actuel : ${dbUserMentionned.xp+xp}`}]})
}
module.exports.help = MESSAGES.Commandes.Moderation.ADDXP;
