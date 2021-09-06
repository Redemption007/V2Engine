const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    args.shift()
    const user = await message.mentions.users.first()
    const raison = args.join(' ') || "Pas de raison spécifiée."
    const Guild = await client.getGuild(message.guild)

    if (!user) return message.reply({embed: {title: 'Oups !', color: 'RED', description: "Il vous faut mentionner un utilisateur pour cette commande."}})
    try {
        await client.unbanGuild(Guild, user)
    } catch (e) {
        message.reply('cet utilisateur n\'est pas banni !')
    }
    await message.reply({embed: {title: "Débannissement réussi !", color: "GREEN", description: `<@${user.id}> peut à nouveau participer aux tournois du serveur !`}})

    return client.channels.cache.get(client.config.CHANNELLOGID).send({embed: {title: "Un bannissment de tournois à été révoqué !", color: 'GREEN', fields: [{name: 'Utilisateur :', value: `<@${user.id}>`}, {name: 'ID :', value: user.id}, {name: 'Raison :', value: raison}], footer: {text: `Bannissement révoqué par ${message.author.tag} (ID: ${message.author.id})`}, timestamp: Date.now()}})
}
module.exports.help = MESSAGES.Commandes.Tournaments.UNBANTOURNOI;
