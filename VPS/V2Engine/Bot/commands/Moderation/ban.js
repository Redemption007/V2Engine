const {MESSAGES} = require('../../starterpack/constants')
const Discord = require('discord.js');

module.exports.run = (client, message, args, settings) => {
    const member = message.mentions.members.first();
    const raison = args.splice(1).join(" ") || "Aucune raison spécifiée.";
    const embed = new Discord.MessageEmbed()
        .setTitle("Paix à son âme...")
        .setColor("RED")
        .setDescription(`${member.toString()} a été banni.`)
        .addField('Raison', `${raison}`, false)
        .setTimestamp()
        .setFooter(`Bannissement effectué par ${message.author.username}.`);

    const log = new Discord.MessageEmbed()
        .setTitle("BAN")
        .setColor("RED")
        .setThumbnail(member.user.avatarURL())
        .setDescription(`${member.toString()} a été banni définitivement.`)
        .addField('Infos de l\'utilisateur', `Pseudo : ${member.user.tag}\nID : ${member.id}`, false)
        .addField('Action :', "Bannissement définitif", false)
        .addField('Raison :', `${raison}`, true)
        .setTimestamp()
        .setFooter(`Bannissement effectué par ${message.author.username}.`, message.author.avatarURL());

    client.channels.cache.get(settings.logChannel).send({embeds: [log]})

    member.ban({days: 7, reason: raison});

    return message.channel.send({embeds: [embed]});
}
module.exports.help = MESSAGES.Commandes.Moderation.BAN;
