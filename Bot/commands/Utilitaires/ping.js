const {MESSAGES} = require('../../starterpack/constants')
const ms = require('../../util/ms')

module.exports.run = async (client, message) => {
    const filterReaction = async r => {
        if (r.users.cache.size<2 || r._emoji.name !== '➕') return false
        let admin = false
        const user = await r.users.cache.find(usr => !usr.bot)
        await message.guild.members.fetch(user.id)
            .then(async mbr => {
                admin = await mbr.permissions.has('ADMINISTRATOR')
                r.users.remove(mbr)
            })
        return admin
    }
    //const globalsettings = client.getGuild('776429325838319616')
    const msg = await message.reply('🕐 Ping... 🕐')
    const APILatency = client.ws.ping
    const BotLatency = Math.round(msg.createdTimestamp - message.createdTimestamp)
    let emote1 = '🔆'
    let emote2 = '🔆'
    if (APILatency > 200) emote1 = '💢'
    if (APILatency > 100 && APILatency < 200) emote1 = '💤'
    if (BotLatency > 200) emote2 = '💢'
    if (BotLatency > 100 && BotLatency < 200) emote2 = '💤'
    msg.edit({content: message.author.toString(), embeds: [{title: '🕐 Pong !', color: 'PURPLE', fields: [{name: 'Latence du bot :', value: `${emote2} ${BotLatency} millisecondes.`, inline: true}, {name: 'Latence de l\'API de Discord :', value: `${emote1} ${APILatency} millisecondes`, inline: true}]}]})
    msg.react('➕')
    msg.awaitReactions({filter: filterReaction, max: 1, time: 30000})
        .then(async coll => {
            if (!coll.first()) return msg.reactions.removeAll()
            const time = ms(Date.now() - client.readyTimestamp, true)
            let joinedTimestamp
            await message.guild.members.fetch(client.user.id)
                .then(m => joinedTimestamp = m.joinedTimestamp)
            const joined = ms(Date.now() - joinedTimestamp, true)
            //const informations = globalsettings.MaJ        {name: 'Informations de la dernière mise à jour :', value: informations}
            msg.edit({embeds: [{title: 'Pong !', color: 'PURPLE', fields: [{name: 'Latence du bot :', value: `${emote2} ${BotLatency} millisecondes.`, inline: true}, {name: 'Latence de l\'API de Discord :', value: `${emote1} ${APILatency} millisecondes`, inline: true}, {name: 'Bot en ligne depuis :', value: time}, {name: "Membre de cette guilde depuis :", value: joined}], footer: {text: 'Les informations supplémentaires ont été affichées', icon_url: client.user.avatarURL()}}]})
            return msg.reactions.removeAll()
        })
}
module.exports.help = MESSAGES.Commandes.Utilitaires.PING;
