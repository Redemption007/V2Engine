const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args, settings, dbUser) => {
    if (message.mentions.members.first()) {
        const member = message.mentions.members.first();
        const dbmemberMentionned = await client.getUser(member)
        const index = await dbmemberMentionned.guildIDs.indexOf(message.guild.id)
        
        if (!dbmemberMentionned) return message.channel.send({embeds: [{color: 'BLUE', description: `Voici l'xp de <@${member.id}> : 0`}]})
        
        return message.channel.send({embeds: [{color: 'BLUE', description: `Voici l'xp de <@${member.id}> : ${dbmemberMentionned.xp[index]}`}]})
    }
    
    const index = await dbUser.guildIDs.indexOf(message.guild.id)
    const member = message.member;

    return message.channel.send({embeds: [{color: 'BLUE', description: `Voici l'xp de <@${member.id}> : ${dbUser.xp[index]}`}]})
}
module.exports.help = MESSAGES.Commandes.Utilitaires.XP;
