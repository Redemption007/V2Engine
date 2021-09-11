const Discord = require('discord.js')

module.exports = async (client, channel) => {
    if (channel.type === 'DM') return;
    const FetchGuildAuditLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_CREATE'
    })
    const ChannelCreated = await FetchGuildAuditLogs.entries.first()
    const settings = await client.getGuild(channel.guild)

    let RoleMute = channel.guild.roles.cache.get(settings.muteRole)
    if (!RoleMute) RoleMute = await channel.guild.roles.cache.find(r => r.name === 'Muted');

    if (RoleMute) {
        await channel.permissionOverwrites.create(RoleMute, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            CONNECT: false
        })
    }
    const {executor} = ChannelCreated
    const log = new Discord.MessageEmbed()
        .setTitle("Nouveau salon Créé")
        .setColor("YELLOW")
        .setDescription(`Par <@${executor.id}>`, executor.displayAvatarURL())
        .addField('__Nom du salon :__', `<#${channel.id}> (${channel.name})`)
        .addField('__Catégorie :__', `${channel.parent}`)
        .setFooter(`Type de salon : ${client.typeOfChannel(channel)}`)
        .setTimestamp();

    client.channels.cache.get(settings.logChannel).send({embeds: [log]})
}
