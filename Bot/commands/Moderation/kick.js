const {MESSAGES} = require('../../starterpack/constants')
const Discord = require('discord.js');

module.exports.run = async (client, message, args, settings) => {
    const member = await message.mentions.member.first();
    const raison = args.splice(1).join(' ') || 'Aucune raison spécifiée.';
    const embed = new Discord.MessageEmbed()
        .setTitle('Ouille !')
        .setColor('RED')
        .setDescription(`${member.toString()} a été kick`)
        .addField('Raison', `${raison}`, false)
        .setTimestamp()
        .setFooter(`Kick effectué par ${message.author.username}.`, message.author.avatarURL())

    const log = new Discord.MessageEmbed()
        .setTitle('KICK')
        .setColor('RED')
        .setThumbnail(member.user.avatarURL())
        .setDescription(`${member.toString()} a été éjecté(e) du serveur.`)
        .addField('Infos de l\'utilisateur', `Pseudo : ${member.user.tag}\nID : ${member.id}`, false)
        .addField('Action :', 'Kick', false)
        .addField('Raison :', `${raison}`, true)
        .setTimestamp()
        .setFooter(`Kick effectué par ${message.author.username}.`, message.author.avatarURL());

    await client.channels.cache.get(settings.logChannel).send({embeds: [log]})

    await member.kick(raison);

    return message.channel.send({embeds: [embed]});
}
module.exports.help = MESSAGES.Commandes.Moderation.KICK;
