const {MESSAGES} = require('../../starterpack/constants')
const embed = require('../../commands/Utilitaires/embed')

module.exports.run = async (client, message, args, settings) => {
    let member = message.guild.member(message.mentions.users.first())
    let xp = -Number(args[1])

    if (!member) { //Si aucun utilisateur n'est mentionné, alors l'utilisateur concerné est celui qui tape la commande
        member = message.member
        xp = -Number(args[0])
    }

    //On vérifie que pour chaque cas, xp est bien un nombre
    if (isNaN(xp)) return embed.run(client, message, `RED;; Oups !;; Voici la forme de la commande : ${settings.prefix}${MESSAGES.Commandes.Moderation.DELETEXP.usage}`)

    const dbUserMentionned = await client.getUser(member)

    if (!dbUserMentionned || xp === 0) {
        return embed.run(client, message, "RED;; AH !;; L'utilisateur concerné n'a aucun points d'xp !")
    }

    await client.updateXP(client, member, xp)

    return embed.run(client, message, `BLUE;; Supression d'xp réussie !;; Vous avez supprimé ${xp} points d'xp à <@${member.id}>.\nVoici son xp actuel : ${dbUserMentionned.xp+xp}`)
}
module.exports.help = MESSAGES.Commandes.Moderation.DELETEXP;
