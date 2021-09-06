const Discord = require('discord.js');
const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = (client, message, args) => {

    const MuteRole = message.guild.roles.cache.find(r => r.name === 'Muted');
    const raison = args.splice(1).join(' ') || 'Aucune raison spécifiée.';

    /*if (args[0] === 'all') {
        return;
    }*/

    const user = message.guild.member(message.mentions.users.first());

    if (!user.roles.cache.has(MuteRole.id)) {
        return message.reply("l'utilisateur concerné n'est pas mute...");
    }
    user.roles.remove(MuteRole.id);

    const embed = new Discord.MessageEmbed()
        .setTitle('Libéré, délivré(e)...')
        .setColor('GREEN')
        .setDescription(`${user} peut à nouveau parler sur le serveur !`);

    if (raison) {
        embed.addField('Raison :', `${raison}`, false)
    }
    embed.setTimestamp()
    embed.setFooter(`Unmute effectué par ${message.author.username}.`, message.author.avatarURL());

    const log = new Discord.MessageEmbed()
        .setTitle('UNMUTE')
        .setColor('GREEN')
        .setThumbnail(user.user.avatarURL())
        .setDescription(`${user} peut à nouveau parler sur le serveur.`)
        .addField('Infos de l\'utilisateur', `Pseudo : ${user.user.tag}\nID : ${user.id}`, false)
        .addField('Action :', 'Unmute', false)
        .setTimestamp()
        .setFooter(`Unmute effectué par ${message.author.username}.`, message.author.avatarURL());

    if (raison) log.addField('Raison :', `${raison}`, true)
    client.channels.cache.get(client.config.CHANNELLOGID).send(log)

    return message.channel.send(embed);
}
module.exports.help = MESSAGES.Commandes.Moderation.UNMUTE;
