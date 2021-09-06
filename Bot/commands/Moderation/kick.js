const {MESSAGES} = require('../../starterpack/constants')
const Discord = require('discord.js');

module.exports.run = (client, message, args) => {
    const user = message.mentions.users.first();
    const raison = args.splice(1).join(' ') || 'Aucune raison spécifiée.';
    const embed = new Discord.MessageEmbed()
        .setTitle('Ouille !')
        .setColor('RED')
        .setDescription(`${user} a été kick`)
        .addField('Raison', `${raison}`, false)
        .setTimestamp()
        .setFooter(`Kick effectué par ${message.author.username}.`, message.author.avatarURL())

    const log = new Discord.MessageEmbed()
        .setTitle('KICK')
        .setColor('RED')
        .setThumbnail(user.avatarURL())
        .setDescription(`${user} a été éjecté(e) du serveur.`)
        .addField('Infos de l\'utilisateur', `Pseudo : ${user.tag}\nID : ${user.id}`, false)
        .addField('Action :', 'Kick', false)
        .addField('Raison :', `${raison}`, true)
        .setTimestamp()
        .setFooter(`Kick effectué par ${message.author.username}.`, message.author.avatarURL());

    client.channels.cache.get(client.config.CHANNELLOGID).send(log)

    message.guild.member(user).kick(raison);

    return message.channel.send(embed);
}
module.exports.help = MESSAGES.Commandes.Moderation.KICK;
