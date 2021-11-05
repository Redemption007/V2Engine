const {MESSAGES} = require('../../starterpack/constants')
const Discord = require('discord.js');

module.exports.run = (_client, message, args) => {
    const member = message.mentions.members.first();
    const raison = args.splice(1).join(" ") || "Aucune raison spécifiée.";
    const embed = new Discord.MessageEmbed()
        .setTitle("Paix à son âme...")
        .setColor("RED")
        .setDescription(`${member.toString()} a été banni.`)
        .addField('Raison', `${raison}`, false)
        .setTimestamp()
        .setFooter(`Bannissement effectué par ${message.author.username}.`);

    return message.channel.send({embeds: [embed]});
}
module.exports.help = MESSAGES.Commandes.Moderation.BANN;
