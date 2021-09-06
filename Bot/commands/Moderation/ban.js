const {MESSAGES} = require('../../starterpack/constants')
const Discord = require('discord.js');

module.exports.run = (client, message, args) => {
    const user = message.mentions.users.first();
    const raison = args.splice(1).join(" ") || "Aucune raison spécifiée.";
    const embed = new Discord.MessageEmbed()
        .setTitle("Paix à son âme...")
        .setColor("RED")
        .setDescription(`${user} a été banni.`)
        .addField('Raison', `${raison}`, false)
        .setTimestamp()
        .setFooter(`Bannissement effectué par ${message.author.username}.`);

    const log = new Discord.MessageEmbed()
        .setTitle("BAN")
        .setColor("RED")
        .setThumbnail(user.avatarURL())
        .setDescription(`${user} a été banni définitivement.`)
        .addField('Infos de l\'utilisateur', `Pseudo : ${user.tag}\nID : ${user.id}`, false)
        .addField('Action :', "Bannissement définitif", false)
        .addField('Raison :', `${raison}`, true)
        .setTimestamp()
        .setFooter(`Bannissement effectué par ${message.author.username}.`, message.author.avatarURL());

    client.channels.cache.get(client.config.CHANNELLOGID).send(log)

    message.guild.member(user).ban({days: 7, reason: raison});

    return message.channel.send(embed);
}
module.exports.help = MESSAGES.Commandes.Moderation.BAN;
