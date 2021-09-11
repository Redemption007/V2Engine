const ms = require('../../util/ms')

module.exports = async (client, tournoiid) => {
    const tournoi = await client.getTournoi({_id: tournoiid})
    const InscriptionsChannel = await client.channels.fetch(tournoi.InscriptionsChannelID)
    const InfosChannel = await client.channels.cache.find(ch => ch.name === "infos-tournoi" && ch.parentID === InscriptionsChannel.parentID)
    const checkintime = await tournoi.Date.valueOf()-300000-Date.now()
    const EndInscriptionsDate = new Date(tournoi.Date.valueOf() - tournoi.InscriptionsFin)
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    const EndInscriptionsTime = EndInscriptionsDate.valueOf()-Date.now()

    await InfosChannel.send('@everyone', {embeds: [{title: 'Début des inscriptions !', description: `Vous pouvez dorénavant vous inscrire dans le salon <#${InscriptionsChannel.id}>.\n> Fin des inscriptions le ${EndInscriptionsDate.toLocaleTimeString('fr-FR', options)}`, color: 'GREEN'}]})
    await InscriptionsChannel.send({embeds: [{title: 'Début des inscriptions !', description: `Vous pouvez dorénavant vous inscrire au tournoi ${tournoi.NomduTournoi}.\n> Fin des inscriptions le ${EndInscriptionsDate.toLocaleTimeString('fr-FR', options)}\nL'inscription à ce tournoi donne le rôle <@&${tournoi.RoleTournoi}>`, color: 'GREEN'}]})

    client.clock((IChannel, t) => {
        IChannel.send({embeds: [{title: 'Les inscriptions sont terminées !', color: 'RED', footer: {text: `Il est dorénavant trop tard pour vous inscrire. Le tournoi commence dans ${ms(t.Date.valueOf()-Date.now())}`}}]})
    }, EndInscriptionsTime, InscriptionsChannel, tournoi)

    client.clock(t => {
        client.emit('checkin', t)
    }, checkintime, tournoi);
}
