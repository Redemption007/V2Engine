const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, args) => {
    const error = await client.getError(args[0])
    if (!error) return message.reply('Cet ID n\'est pas valide !')
    message.reply({embeds: [{
        title: 'Log de l\'erreur :',
        color: 'RED',
        fields: [
            {name: 'Commande concernée :', value: error.command},
            {name: 'Serveur :', value: `${error.guildName} (${error.guildID})`},
            {name: 'Contenu du message initial :', value: error.content},
            {name: 'Erreur :', value: "```txt\n"+error.error+"```"},
            {name: 'Logs :', value: "```txt\n"+error.source+"```"}
        ],
        author: {name: error.user},
        timestamp: error.date
    }]})
}
module.exports.help = MESSAGES.Commandes.Admin.LOGERROR;