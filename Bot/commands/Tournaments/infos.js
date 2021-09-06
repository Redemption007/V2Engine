const {MESSAGES} = require('../../starterpack/constants')
const ms = require('ms')

module.exports.run = async (client, message) => {
    let tournoi = await client.getTournoi({InscriptionsChannelID: message.channel.id})

    if (!tournoi) tournoi = await client.getTournoi({StaffChannelID: message.channel.id})
    if (!tournoi) return message.reply(' vous n\'avez pas envoyé la commande dans un salon d\'inscriptions.')
    const timer = tournoi.Date.valueOf() - Date.now()
    let inscriptions = ''
    let inscriptionsdate = ''
    let Tournoi = ''
    let timetournoi = ''
    const DateInscriptions = tournoi.InscriptionsDate.valueOf()
    const FinInscriptions = tournoi.Date.valueOf()-tournoi.InscriptionsFin
    const duration = tournoi.Date.valueOf()+tournoi.Duree-Date.now()
    const InfosChannel = await message.guild.channels.cache.find(ch => ch.parentID === message.channel.parentID && ch.name === 'infos-tournoi')

    if (DateInscriptions > Date.now()) {
        inscriptions = 'Les inscriptions n\'ont pas encore commencé ! Début des inscriptions dans :'
        inscriptionsdate = `${ms(DateInscriptions-Date.now(), true)}`
        Tournoi = "Temps restant avant le début du tournoi :"
        timetournoi = `${ms(timer, true)}`
    } else {
        if (FinInscriptions > Date.now()) {
            inscriptions = 'Les inscriptions ont débuté ! Fin des inscriptions dans :'
            inscriptionsdate = `${ms(FinInscriptions-Date.now(), true)}`
            Tournoi = "Temps restant avant le début du tournoi :"
            timetournoi = `${ms(timer, true)}`
        } else {
            if (timer <0) {
                inscriptions = 'Le tournoi a commencé ! Fin du tournoi dans :'
                inscriptionsdate = `${ms(timer+duration, true)}`
                Tournoi = 'Le tournoi a débuté il y a :'
                timetournoi = `${ms(timer, true)}`
            } else {
                inscriptions = 'Les inscriptions sont closes ! Check-in dans :'
                inscriptionsdate = `${ms(timer-300000, true)}`
                Tournoi = 'Le tournoi va commencer dans :'
                timetournoi = `${ms(timer, true)}`
            }
        }
    }


    return message.reply({embed: {
        color: 'AQUA',
        title: `Informations sur le tournoi ${tournoi.NomduTournoi} :`,
        fields: [
            {name: 'Salon d\'informations complémentaires :', value: `<#${InfosChannel.id}>`},
            {name: Tournoi, value: timetournoi},
            {name: inscriptions, value: inscriptionsdate},
            {name: 'Nombre d\'équipes inscrites :', value: `${tournoi.Inscrits.length}/${tournoi.NbdeTeams}`},
        ],
        footer: {text: "Si le nombre d'équipes inscrites atteint son maximum, vous pouvez toujours essayer de vous inscrire en demandant à rejoindre une équipe au hasard."}
    }})
}
module.exports.help = MESSAGES.Commandes.Tournaments.INFOS;
