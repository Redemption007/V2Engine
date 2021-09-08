const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args, settings, dbUser) => {
    if (message.mentions.members.first()) {
        const member = message.mentions.members.first();
        const dbmemberMentionned = await client.getUser(member)

        if (!dbmemberMentionned) return message.channel.send({embeds: [{color: 'BLUE', title: `Voici l'xp de <@${member.id}> : 0`}]})

        return message.channel.send({embeds: [{color: 'BLUE', title: `Voici l'xp de <@${member.id}> : ${dbmemberMentionned.xp}0`}]})
    }

    const member = message.member;

    return message.channel.send({embeds: [{color: 'BLUE', title: `Voici l'xp de <@${member.id}> : ${dbUser.xp}`}]})
}
module.exports.help = MESSAGES.Commandes.Utilitaires.XP;
