const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args, settings) => {
    args.shift()
    const user = await message.mentions.users.first()
    const raison = args.join(' ') || "Pas de raison spécifiée."
    const Guild = await client.getGuild(message.guild)

    if (!user) return message.reply({embeds: [{title: 'Oups !', color: 'RED', description: "Il vous faut mentionner un utilisateur pour cette commande."}]})
    try {
        await client.banGuild(Guild, user)
    } catch (e) {
        message.reply('Cet utilisateur est déjà banni !')
    }
    await message.reply({embeds: [{title: "Bannissement réussi !", color: "GREEN", description: `Vous venez de bannir avec succès <@${user.id}> des tournois du serveur !`}]})

    return client.channels.cache.get(settings.logChannel).send({embeds: [{title: "Un utilisateur a été banni des tournois du serveur !", color: 'RED', fields: [{name: 'Utilisateur :', value: `<@${user.id}>`}, {name: 'ID :', value: user.id}, {name: 'Raison :', value: raison}], footer: {text: `Bannissement demandé par ${message.author.tag} (ID: ${message.author.id})`}, timestamp: Date.now()}]})
}
module.exports.help = MESSAGES.Commandes.Tournaments.BANTOURNOI;
