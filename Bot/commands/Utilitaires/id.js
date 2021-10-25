const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = (_client, message, args) => {
    let description = `Voici l'id de "${args[0]}"`
    if (!message.mentions.channels.size && !message.mentions.members.size && !message.mentions.users.size && !message.mentions.roles.size && !message.mentions.everyone && !message.guild.emojis.resolveId(args[0])) description = `Voici la version unicode de "${args[0]}"`
    message.channel.send({embeds: [{color: "BLUE", description: `${description} :\n\n\`${args[0]}\``}]})
}
module.exports.help = MESSAGES.Commandes.Utilitaires.ID;
