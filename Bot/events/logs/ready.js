const ms = require('ms')

module.exports = async client => {
    const mainserver = await client.guilds.fetch(client.config.MAINGUILDID)
    const logchannel = await mainserver.channels.fetch(client.config.CHANNELLOGID)
    console.log(`\nConnecté en tant que ${client.user.tag} !`);
    client.user.setPresence({status: 'online', activity: {name: 'l\'extension de son registre de commandes', type: 'COMPETING'}})
    logchannel.send({embeds:[{color: 'GOLD', title: 'Merci de votre patience', description: 'Le bot est opérationnel !', timestamp: Date.now()}]})

    const tournois = await client.getAllTournois()
    if (!tournois) return
    tournois.forEach(async to => {
        let log = "+1 tournoi détecté !"
        let event = ''
        let time = 0
        const timer = to.Date.valueOf()-Date.now()
        const EndInscriptionsTime = to.Date.valueOf()-to.InscriptionsFin-Date.now()
        const inscriptionstime = to.InscriptionsDate.valueOf()-Date.now()
        const checkin = timer-300000
        const StaffChannel = await client.channels.fetch(to.StaffChannelID)
        const InscriptionsChannel = await StaffChannel.guild.channels.cache.find(cha => cha.parentID === StaffChannel.parentID && cha.name === 'inscriptions-tournoi')

        console.log(log)

        if (timer<0) return
        if (EndInscriptionsTime>0) {
            client.clock((IChannel, tDate) => {
                IChannel.send({embed: {title: 'Les inscriptions sont terminées !', color: 'RED', footer: {text: `Il est dorénavant trop tard pour vous inscrire. Le tournoi commence dans ${ms(tDate.valueOf()-Date.now())}`}}})
            }, EndInscriptionsTime, InscriptionsChannel, to.Date)
        }
        if (inscriptionstime>0) {
            time = inscriptionstime
            event = 'begintournoi'
            log = "+1 inscription mise en attente."
        } else {
            if (checkin>0) {
                time = checkin
                event = 'checkin'
                log = '+1 checkin mis en attente'
            } else {
                time = timer
                event = 'createlobbys'
                log = "+1 tournoi mis en attente"
            }
        }
        console.log(log);

        client.clock(tnid => {
            client.emit(event, tnid)
        }, time, to._id)
    })
}
