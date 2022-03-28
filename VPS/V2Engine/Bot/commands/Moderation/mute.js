const {MESSAGES} = require('../../starterpack/constants')
const ms = require('../../util/ms');

module.exports.run = async (client, message, args, settings) => {

    //VERIFICATION DE LA COMMANDE :

    const TimeMute = args[1]
    let raison = args.splice(2).join(' ') || 'Aucune raison spécifiée.';

    if (!ms(TimeMute)) raison = (args[1]||' ') + ' ' + raison;
    if (raison===' ') raison = 'Aucune raison spécifiée.';

    const member = message.mentions.members.first();
    let RoleMute = await message.guild.roles.fetch(settings.muteRole)
    if (!RoleMute) RoleMute = await message.guild.roles.cache.find(r => r.name === 'Muted');
    if (RoleMute && member.roles.cache.get(RoleMute.id)) return message.reply('Cet utilisateur est déjà mute !')

    //CREATION DU ROLE MUTED S'IL N'EST PAS DEJA CRÉÉ :

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

    if (!ms(TimeMute)) { //SI PAS DE DUREE FOURNIE :
        const embed = {embeds: [{title: 'La paix !', color: 'ORANGE', description: `<@${member.id}> a été rendu muet sur le serveur.`, fields: [{name: 'Raison :', value: raison}], timestamp: Date.now(), footer: {text: `Mute effectué par ${message.author.username}.`, icon_url: message.author.avatarURL()}}]}

        const log = {embeds: [{title: 'MUTE', color: 'ORANGE', thumbnail: member.user.avatarURL(), description: `<@${member.id}> a été rendu muet sur le serveur.`, fields: [{name: 'Infos de l\'utilisateur', value: `Pseudo : ${member.user.tag}\nID : ${member.id}`}, {name: 'Action :', value: 'Mute'}, {name: 'Durée :', value: `Définitive`, inline: true}, {name: 'Raison :', value: `${raison}`, inline: true}], timestamp: Date.now(), footer: {text: `Mute effectué par ${message.author.username}.`, icon_url: message.author.avatarURL()}}]}

        await client.channels.fetch(settings.logChannel).then(ch => ch.send(log))

        return message.channel.send(embed);
    }
    //SI LA DUREE EST FOURNIE
    const embed = {embeds: [{title: 'La paix !', color: 'ORANGE', description: `<@${member.id}> a été rendu muet pour ${ms(ms(TimeMute), true)} sur le serveur.`, fields: [{name: 'Raison :', value: raison}], timestamp: Date.now(), footer: {text: `Mute effectué par ${message.author.username}.`, icon_url: message.author.avatarURL()}}]}

    const log = {embeds: [{title: 'TEMPMUTE', color: 'ORANGE', thumbnail: member.user.avatarURL(), description: `<@${member.id}> a été rendu muet sur le serveur.`, fields: [{name: 'Infos de l\'utilisateur', value: `Pseudo : ${member.user.tag}\nID : ${member.id}`, inline: false}, {name: 'Action :', value: 'Tempmute', inline: false}, {name: 'Durée :', value: `${ms(ms(TimeMute), true)}`, inline: true}, {name: 'Raison :', value: raison, inline: true}], timestamp: Date.now(), footer: {text: `Mute effectué par ${message.author.username}.`, icon_url: message.author.avatarURL()}}]}

    await client.channels.fetch(settings.logChannel).then(ch => ch.send(log))
    await message.channel.send(embed);

    //UNMUTE PROGRAMMÉ :

    client.clock( async (msg, mbr, RoleMuteID) => {
        if (!mbr.roles.cache.has(RoleMuteID)) return
        await mbr.roles.remove(RoleMuteID)
        await msg.channel.send({embeds: [{title: 'Libéré, délivré(e)...', description: `${mbr} peut à nouveau parler sur le serveur !`, color: 'GREEN', fields: [{name: 'Raison du unmute :', value: `Le temps (${ms(ms(TimeMute), true)}) est écoulé.`}], timestamp: Date.now()}]})
        const logChannel = await client.channels.fetch(settings.logChannel)
        logChannel.send({embeds: [{title: 'UNMUTE', color: 'GREEN', description: `${mbr} a été unmute car le temps (${ms(ms(TimeMute), true)}) est écoulé.`, timestamp: Date.now()}]})
    }, ms(TimeMute), message, member, RoleMute.id)
}
module.exports.help = MESSAGES.Commandes.Moderation.MUTE;
