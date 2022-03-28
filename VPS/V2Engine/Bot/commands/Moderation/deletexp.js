const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args, settings) => {
    let member = message.mentions.members.first()
    let xp = +args[1]

    if (!member) { //Si aucun utilisateur n'est mentionné, alors l'utilisateur concerné est celui qui tape la commande
        member = message.member
        xp = +args[0]
    }
    const dbUserMentionned = await client.getUser(member)
    const index = await dbUserMentionned.guildIDs.indexOf(message.guild.id)

    //On vérifie que pour chaque cas, xp est bien un nombre et que le membre est valide
    if (isNaN(xp) || !dbUserMentionned) return message.reply({embeds: [{color: 'RED', title: 'Oups !', description: `Voici la forme de la commande : ${settings.prefix}${MESSAGES.Commandes.Moderation.DELETEXP.usage}`}]})


    if (dbUserMentionned.xp[index] === 0) return message.reply({embeds: [{color: 'RED', title: 'AH !', description: `L'utilisateur concerné n'a aucun points d'xp !`}]})
    if (dbUserMentionned.xp[index]- Math.abs(xp)<0) xp = dbUserMentionned.xp[index]

    await client.updateXP(member, message.guild.id, -Math.abs(xp))

    return message.reply({embeds: [{color: 'BLUE', title: 'Supression d\'xp réussie !', description: `Vous avez supprimé ${xp} points d'xp à <@${member.id}>.\nVoici son xp total actuel : ${dbUserMentionned.xp[index]-xp}`}]})
}
module.exports.help = MESSAGES.Commandes.Moderation.DELETEXP;

