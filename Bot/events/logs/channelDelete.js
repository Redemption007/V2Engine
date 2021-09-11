const Discord = require('discord.js')
// const Reactor = require('../../modeles/reactor')

module.exports = async (client, channel) => {
    if (channel.type === 'DM') return;
    const settings = await client.getGuild(channel.guild)
    const FetchGuildAuditLogs = await channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_DELETE'
    })
    const ChannelDeleted = await FetchGuildAuditLogs.entries.first()
    const {executor} = ChannelDeleted
    const {target} = ChannelDeleted
    const {reason} = ChannelDeleted
    let nsfw = 'Aucune';

    if (target.nsfw) nsfw = 'Salon Not Safe For Work (NSFW)';
    const log = new Discord.MessageEmbed()
        .setTitle("Salon Supprimé")
        .setColor("YELLOW")
        .setDescription(`Par <@${executor.id}>`, executor.displayAvatarURL())
        .addField('__Nom du salon :__', `${channel.name}`)
        .addField('__Catégorie :__', `${channel.parent || 'Sans catégorie'}`)
        .addField('__Détails :__', `*Raison :* ${reason || 'Pas de raison précisée'}\n*Spécification :* ${nsfw}\n*Sujet :* ${target.topic}`)
        .setFooter(`Type de salon : ${client.typeOfChannel(channel)}`)
        .setTimestamp();

    client.channels.cache.get(settings.logChannel).send({embeds: [log]})
    /*
    const reactors = await client.getReactors(channel)
    if (reactors) {
        for (let i=0; i<reactors.size; i++) {
            await reactors[i].delete()
        }
    }
    const senders = await client.getSenders(channel)
    if (senders.size) {
        console.log('Modification de l\'envoi d\'informations des réacteurs');
        for (let j=0; j<senders.size; j++) {
            const index = await senders[j].channelsending.indexOf(channel.id)
            if (senders[j].channelsending.size>1) senders[j].channelsending.slice(index, 1)
            //Sinon on redirige le message vers le salon général, et on prévient les admins
            else {
                const settings = await client.getGuild({guildID: channel.guild.id})
                senders[j].channelsending = settings.generalChannel
                client.channels.cache.get(client.config.CHANNELLOGID).send({embeds: [{title: 'ATTENTION !', color: 'RED', fields: [{name: '', value: `Un réacteur a été modifié, en raison de la suppression du channel ${channel.name}`}, {name: 'Nouveau salon d\'envoi des informations :', value: `<#${settings.generalChannel}> (ID: ${settings.generalChannel})`}], footer: {text: 'Pour changer le salon d\'envoi des informations, faites `!changereactor` ou `!cr`'}, timestamp: Date.now()}]})
            }
            await senders[j].save()
        }
    }*/
}
