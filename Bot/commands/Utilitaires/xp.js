const {MESSAGES} = require('../../starterpack/constants')
const embed = require('../../commands/Utilitaires/embed')

module.exports.run = async (client, message, args, settings, dbUser) => {
    if (message.mentions.members.first()) {
        const member = message.mentions.members.first();
        const dbmemberMentionned = await client.getUser(member)

        if (!dbmemberMentionned) return embed.run(client, message, `BLUE;;  ;; Voici l'xp de <@${member.id}> : 0`)

        return embed.run(client, message, `BLUE;;  ;; Voici l'xp de <@${member.id}> : ${dbmemberMentionned.xp}`)
    }

    const member = message.member;

    return embed.run(client, message, `BLUE;;  ;; Voici l'xp de <@${member.id}> : ${dbUser.xp}`);
}
module.exports.help = MESSAGES.Commandes.Utilitaires.XP;
