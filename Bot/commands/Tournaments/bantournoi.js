const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    args.shift()
    const user = await message.mentions.users.first()
    const raison = args.join(' ') || "Pas de raison spécifiée."
    const Guild = await client.getGuild(message.guild)

    if (!user) return message.reply({embed: {title: 'Oups !', color: 'RED', description: "Il vous faut mentionner un utilisateur pour cette commande."}})
    try {
        await client.banGuild(Guild, user)
    } catch (e) {
        message.reply('cet utilisateur est déjà banni !')
    }
    await message.reply({embed: {title: "Bannissement réussi !", color: "GREEN", description: `Vous venez de bannir avec succès <@${user.id}> des tournois du serveur !`}})

    return client.channels.cache.get(client.config.CHANNELLOGID).send({embed: {title: "Un utilisateur a été banni des tournois du serveur !", color: 'RED', fields: [{name: 'Utilisateur :', value: `<@${user.id}>`}, {name: 'ID :', value: user.id}, {name: 'Raison :', value: raison}], footer: {text: `Bannissement demandé par ${message.author.tag} (ID: ${message.author.id})`}, timestamp: Date.now()}})
}
module.exports.help = MESSAGES.Commandes.Tournaments.BANTOURNOI;
