const ms = require('ms')

module.exports = async client => {
    const mainGuild = await client.getGuild({id: '776429325838319616'})
    // console.log('mainGuild = ', mainGuild);
    const mainserver = await client.guilds.fetch('776429325838319616')
    // console.log("mainserver = ", mainserver);
    const generalchannel = await mainserver.channels.cache.get(mainGuild.generalChannel)
    // console.log('generalchannel = ', generalchannel);
    console.log(`\nConnecté en tant que ${client.user.tag} !`);
    client.user.setPresence({status: 'online', activity: {name: 'l\'extension de son registre de commandes', type: 'COMPETING'}})
    generalchannel.send({embed: {color: 'GOLD', title: 'Merci de votre patience', description: 'Le bot est opérationnel !', timestamp: Date.now()}})

    await client.guilds.cache.each(async guild => {
        await guild.channels.cache.each(async ch => {
            const to = await client.getTournoi({StaffChannelID: ch.id})

            if (to) {
                let log = "+1 tournoi détecté !"
                let event = ''
                let time = 0
                const timer = to.Date.valueOf()-Date.now()
                const EndInscriptionsTime = to.Date.valueOf()-to.InscriptionsFin-Date.now()
                const inscriptionstime = to.InscriptionsDate.valueOf()-Date.now()
                const checkin = timer-300000
                const StCh = await guild.channels.cache.get(to.StaffChannelID)
                const InscriptionsChannel = await guild.channels.cache.find(cha => cha.parentID === StCh.parentID && cha.name === 'inscriptions-tournoi')

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
            }
        })
    })
}
