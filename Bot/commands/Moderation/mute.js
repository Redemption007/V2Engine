const {MESSAGES} = require('../../starterpack/constants')
const ms = require('../../../../ms');

module.exports.run = async (client, message, args, settings) => {

    //VERIFICATION DE LA COMMANDE :

    const TimeMute = args[1]
    let raison = args.splice(2).join(' ') || 'Aucune raison spécifiée.';

    if (!ms(TimeMute)) raison = args[1] + ' ' + raison || 'Aucune raison spécifiée.';

    //CREATION DU ROLE MUTED S'IL N'EST PAS DEJA CRÉÉ :

    const member = message.mentions.members.first();
    let RoleMute = await message.guild.roles.fetch(settings.muteRole)
    if (!RoleMute) RoleMute = await message.guild.roles.cache.find(r => r.name === 'Muted');

    if (!RoleMute) {
        RoleMute = await message.guild.roles.create({
            data: {
                name: 'Muted',
                color: 'GREY',
                permissions: []
            }
        })
        message.guild.channels.cache.forEach(async channel => {
            await channel.permissionOverwrites.create(RoleMute, {
                'SEND_MESSAGES': false,
                'ADD_REACTIONS': false,
                'CONNECT': false
            })
        })

    }
    await member.roles.add(RoleMute.id);

    //MUTE ENVOYÉ :

    if (!ms(TimeMute)) {
        const embed = {embed: {title: 'La paix !', color: 'ORANGE', description: `<@${member.id}> a été rendu muet sur le serveur.`, fields: [{name: 'Raison :', value: raison}], timestamp: Date.now(), footer: {text: `Mute effectué par ${message.author.username}.`, icon_url: message.author.avatarURL()}}}

        const log = {embed: {title: 'MUTE', color: 'ORANGE', thumbnail: member.user.avatarURL(), description: `<@${member.id}> a été rendu muet sur le serveur.`, fields: [{name: 'Infos de l\'utilisateur', value: `Pseudo : ${member.user.tag}\nID : ${member.id}`}, {name: 'Action :', value: 'Mute'}, {name: 'Durée :', value: `Définitive`, inline: true}, {name: 'Raison :', value: `${raison}`, inline: true}], timestamp: Date.now(), footer: {text: `Mute effectué par ${message.author.username}.`, icon_url: message.author.avatarURL()}}}

        client.channels.fetch(settings.logChannel).send({embeds: [log]})

        return message.channel.send({embeds: [embed]});
    } else {
        const embed = {embed: {title: 'La paix !', color: 'ORANGE', description: `<@${member.id}> a été rendu muet pour ${ms(ms(TimeMute), true)} sur le serveur.`, fields: [{name: 'Raison :', value: raison}], timestamp: Date.now(), footer: {text: `Mute effectué par ${message.author.username}.`, icon_url: message.author.avatarURL()}}}

        const log = {embed: {title: 'TEMPMUTE', color: 'ORANGE', thumbnail: member.user.avatarURL(), description: `<@${member.id}> a été rendu muet sur le serveur.`, fields: [{name: 'Infos de l\'utilisateur', value: `Pseudo : ${member.user.tag}\nID : ${member.id}`, inline: false}, {name: 'Action :', value: 'Tempmute', inline: false}, {name: 'Durée :', value: `${ms(ms(TimeMute), true)}`, inline: true}, {name: 'Raison :', value: raison, inline: true}], timestamp: Date.now(), footer: {text: `Mute effectué par ${message.author.username}.`, icon_url: message.author.avatarURL()}}}

        await client.channels.fetch(settings.logChannel).send({embeds: [log]})
        await message.channel.send({embeds: [embed]});
    }

    //UNMUTE PROGRAMMÉ :

    client.clock( async (mssage, mmbr, RoleMuteID) => {
        await mmbr.roles.remove(RoleMuteID)
        await mssage.channel.send({embeds: [{title: 'Libéré, délivré(e)...', description: `<@${mmbr.id}> peut à nouveau parler sur le serveur !`, color: 'GREEN', fields: [{name: 'Raison du unmute :', description: `Le temps (${ms(ms(TimeMute), true)}) est écoulé.`}], timestamp: Date.now()}]})
        await client.channels.fetch(settings.logChannel).send({embeds: [{title: 'UNMUTE', color: 'GREEN', description: `<@${mmbr}> a été unmute car le temps (${ms(ms(TimeMute), true)}) est écoulé.`, timestamp: Date.now()}]})
    }, message, member, RoleMute.id)
}
module.exports.help = MESSAGES.Commandes.Moderation.MUTE;
