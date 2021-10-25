const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {
    const guild = await message.guild
    const tournoi = await client.getTournoi({StaffChannelID: message.channel.id})

    if (!tournoi) return message.reply('Vous n\'avez pas envoyé cette commande dans un channel staff de tournoi !')
    const StaffChannel = await guild.channels.fetch(tournoi.StaffChannelID)
    const InfosChannel = await guild.channels.cache.find(ch => ch.name === 'infos-tournoi' && ch.parentID === StaffChannel.parentID)
    const category = await guild.channels.fetch(StaffChannel.parentId)
    const InscriptionsChannel = await guild.channels.fetch(tournoi.InscriptionsChannelID)
    const role = await guild.roles.fetch(tournoi.RoleTournoi)

    if (InfosChannel) await InfosChannel.delete('Suppression du tournoi')
    if (InscriptionsChannel) await InscriptionsChannel.delete('Suppression du tournoi')
    if (StaffChannel) await StaffChannel.delete('Suppression du tournoi')
    if (category) await category.delete('Suppression du tournoi')
    if (role) await role.delete('Suppression du tournoi')

    return client.deleteTournoi(tournoi)
}
module.exports.help = MESSAGES.Commandes.Tournaments.DELETETOURNOI;
