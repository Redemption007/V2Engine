const {MESSAGES} = require('../../starterpack/constants')
const ms = require('ms')

module.exports.run = async (client, message) => {
    let tournoi = await client.getTournoi({InscriptionsChannelID: message.channel.id})

    if (!tournoi) tournoi = await client.getTournoi({StaffChannelID: message.channel.id})
    if (!tournoi) return message.reply("vous n'avez pas envoyé cette commande dans la catégorie d'un tournoi !")
    let Description = ''
    const DateInscriptions = tournoi.InscriptionsDate.valueOf()
    const FinInscriptions = tournoi.Date.valueOf()-tournoi.InscriptionsFin
    const duration = tournoi.Date.valueOf()+tournoi.Duree-Date.now()

    if (DateInscriptions > Date.now()) Description += `\
    \nDébut des inscriptions dans :\n> ${ms(DateInscriptions-Date.now(), true)}`
    if (FinInscriptions > Date.now()) Description += `\
    \n\nFin des inscriptions dans :\n> ${ms(FinInscriptions-Date.now(), true)}`
    if (tournoi.Date.valueOf()>Date.now()) Description += `\
    \n\nDébut du tournoi dans :\n> ${ms(tournoi.Date.valueOf()-Date.now(), true)}`
    Description += `\n\nFin du tournoi dans :\n> ${ms(duration, true)}`

    message.reply({embed: {
        color: 'AQUA',
        title: `Timers du tournoi ${tournoi.NomduTournoi} :`,
        description: Description,
    }})
}
module.exports.help = MESSAGES.Commandes.Tournaments.TIMER;
