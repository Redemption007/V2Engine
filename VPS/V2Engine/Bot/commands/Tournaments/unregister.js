const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {
    const tournoi = await client.getTournoi({InscriptionsChannelID: message.channel.id})
    if (!tournoi) return message.reply('Vous n\'avez pas envoyé la commande dans le salon d\'inscriptions d\'un tournoi.')
    
    const settings = await client.getGuild(message.guild)
    const member = message.guild.members.cache.get(message.author.id)
    const User = await client.getUser(message.author)

    try {
        await client.unregisterTournoi(tournoi, message.author)
    } catch (e) {
        return message.reply('Vous n\'étiez pas inscrit à ce tournoi.')
    }
    member.roles.remove(tournoi.RoleTournoi)
    try {
        if (User.dmable) {
            message.author.send(`Vous venez de vous désinscrire avec succès du tournoi ${tournoi.NomduTournoi} dans <#${message.channel.id}>\nFaites \`${settings.prefix}register\` dans ce même salon pour vous réinscrire.`)
        }
    } catch (e) {
        message.guild.channels.get(settings.logchannel).send(`Ce boloss de <@${message.author.id}> a autorisé les DMs du bot mais pas ceux du serveur (paramètres de confidentialité)`)
    }

    return message.reply({embeds: [{color: 'DARK_GREEN', title: 'Désinscription réussie !', description: 'Vous avez été désinscrits avec succès de ce tournoi.'}]})
}
module.exports.help = MESSAGES.Commandes.Tournaments.UNREGISTER;
