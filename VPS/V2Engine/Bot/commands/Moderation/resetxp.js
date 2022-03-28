const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    let member
    if (message.mentions.members.size) member = message.mentions.members.first()
    if (!isNaN(+args[0])) member = {id: args[0]}

    if (!member) return message.reply('Cet utilisateur n\'existe pas ! Merci de mentionner l\'utilisateur ou de mettre un ID valide.')

    const dbUserMentionned = await client.getUser(member)

    if (!dbUserMentionned) return message.reply('Cet utilisateur n\'avait pas d\'expérience !')
    let index = await dbUserMentionned.guildIDs.indexOf(message.guild.id)
    if (index == -1) return message.reply('Cet utilisateur n\'avait pas d\'expérience !')
    await client.updateXP(member, message.guild.id, -Math.abs(dbUserMentionned.xp[index]))

    return message.reply(`Vous avez reset avec succès l'expérience de <@${member.id}>.`)
}
module.exports.help = MESSAGES.Commandes.Moderation.RESETXP;
