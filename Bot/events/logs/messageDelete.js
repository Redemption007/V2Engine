const Discord = require('discord.js')
const Reactor = require('../../modeles/reactor')

module.exports = async (client, message) => {
    const settings = await client.getGuild(message.guild)

    const reactors = await Reactor.find(r => {
        if (!r) return false
        return message.id === r.msgReactorID
    })
    if (reactors.length) reactors[0].delete()
    if (message.partial) return

    const FetchGuildAuditLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_DELETE',
        before: Date.now()-2
    })
    const MessageDeleted = await FetchGuildAuditLogs.entries.first()
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const Time = message.editedAt || message.createdAt
    let contenu
    let ensemble
    
    if (message.content.startsWith(`${settings.prefix}`)||message.content.startsWith(`${client.config.NAME}`)) return;
    if (MessageDeleted) {
        message.content === ''? contenu = `***:warning: L${message.embeds.length>1?'es':"'"} intégration${message.embeds.length>1?'s':''} du message supprimé ${message.embeds.length>1?'sont':'est'} postée${message.embeds.length>1?'s':''} ci-après. :warning:***` : contenu = `:speech_balloon: ${message.content}`

        const log = new Discord.MessageEmbed()
            .setTitle("Message Supprimé")
            .setColor("BLUE")
            .setDescription(`Dernière édition du message concerné le ${Time.toLocaleDateString('fr-FR', options)} à ${Time.toLocaleTimeString('fr-FR')}`)
            .addField('__Salon :__', `<#${message.channel.id}>`)
            .addField('__Catégorie :__', `${message.channel.parent}`)
            .addField('__Contenu :__', `${contenu}`)
            .addField('__Modération :__', `Message de ${message.author} supprimé par ${MessageDeleted.target.toString()}`)
            .setFooter('', MessageDeleted.target.displayAvatarURL())
            .setTimestamp();
        ensemble=[log]
        if (message.embeds.length) ensemble=[log].concat(message.embeds)
        return client.channels.cache.get(settings.logChannel).send({embeds: ensemble})
    }
    message.content === ''? contenu = `***:warning: L${message.embeds.length>1?'es':"'"} intégration${message.embeds.length>1?'s':''} du message supprimé ${message.embeds.length>1?'sont':'est'} postée${message.embeds.length>1?'s':''} ci-après. :warning:***` : contenu = `:speech_balloon: ${message.content}`

    const log = new Discord.MessageEmbed()
        .setTitle("Message Supprimé")
        .setColor("BLUE")
        .setDescription(`Dernière édition du message concerné le ${Time.toLocaleDateString('fr-FR', options)} à ${Time.toLocaleTimeString('fr-FR')}`)
        .addField('__Salon :__', `<#${message.channel.id}>`, true)
        .addField('__Catégorie :__', `${message.channel.parent}`, true)
        .addField('__Contenu :__', `${contenu}`)
        .addField('__C\'était quoi ça ?__', `${message.author} à supprimé son message !`)
        .setFooter('', `${message.author.displayAvatarURL()}`)
        .setTimestamp();
    ensemble=[log]
    if (message.embeds.length) ensemble=[log].concat(message.embeds)
    return client.channels.cache.get(settings.logChannel).send({embeds: ensemble})
}
