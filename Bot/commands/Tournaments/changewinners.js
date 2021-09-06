const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    const tournoi = await client.getTournoi({StaffChannelID: message.channel.id})
    if (tournoi.Lobbys<3) return message.reply('Il n\'y a que deux équipes par lobby, vous ne pouvez donc pas modifier le nombre d\'équipes gagnantes, fixé à 1.')
    if (isNaN(+args[0])||+args[0]>tournoi.Lobbys||+args[0]<0) return message.reply(`vous devez indiquer un chiffre compris entre 1 et ${tournoi.Lobbys}`)
    await message.reply(`Le nombre de gagnant${+args[0]>1? 's ':' '}par lobby est bien passé de ${tournoi.Gagnants} à ${args[0]}`)
    tournoi.Gagnants = +args[0]
    return tournoi.save()
}
module.exports.help = MESSAGES.Commandes.Tournaments.CHANGEWINNERS;
