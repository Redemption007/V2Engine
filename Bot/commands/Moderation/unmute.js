const Discord = require('discord.js');
const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = (client, message, args, settings) => {

    const MuteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
    const raison = args.splice(1).join(' ') || 'Aucune raison spécifiée.';

    /*if (args[0] === 'all') {
        return;
    }*/

    const member = message.mentions.members.first();

    if (!member.roles.cache.has(MuteRole.id)) {
        return message.reply("l'utilisateur concerné n'est pas mute...");
    }
    member.roles.remove(MuteRole.id);

    const embed = new Discord.MessageEmbed()
        .setTitle('Libéré, délivré(e)...')
        .setColor('GREEN')
        .setDescription(`${member.toString()} peut à nouveau parler sur le serveur !`);

    if (raison) {
        embed.addField('Raison :', `${raison}`, false)
    }
    embed.setTimestamp()
    embed.setFooter(`Unmute effectué par ${message.author.username}.`, message.author.avatarURL());

    const log = new Discord.MessageEmbed()
        .setTitle('UNMUTE')
        .setColor('GREEN')
        .setThumbnail(member.user.avatarURL())
        .setDescription(`${member} peut à nouveau parler sur le serveur.`)
        .addField('Infos de l\'utilisateur', `Pseudo : ${member.user.tag}\nID : ${member.id}`, false)
        .addField('Action :', 'Unmute', false)
        .setTimestamp()
        .setFooter(`Unmute effectué par ${message.author.username}.`, message.author.avatarURL());

    if (raison) log.addField('Raison :', `${raison}`, true)
    client.channels.cache.get(settings.logChannel).send({embeds: [log]})

    return message.channel.send({embeds: [embed]});
}
module.exports.help = MESSAGES.Commandes.Moderation.UNMUTE;
