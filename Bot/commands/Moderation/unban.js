const {MESSAGES} = require('../../starterpack/constants')
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const user = await client.users.fetch(args[0]);
    const raison = args[1] || "Pas de raison spécifiée.";

    await message.guild.members.unban(user)

    const embed = new Discord.MessageEmbed()
        .setTitle("Un revenant !!!")
        .setColor("GREEN")
        .setDescription(`${user} a été débanni.`)
        .setTimestamp()
        .setFooter(`Bannissement révoqué par ${message.author.username}.`);

    const log = new Discord.MessageEmbed()
        .setTitle("UNBAN")
        .setColor("GREEN")
        .setThumbnail(user.avatarURL())
        .setDescription(`${user} a été débanni.`)
        .addField('Infos de l\'utilisateur', `Pseudo : ${user.tag}\nID : ${user.id}`, false)
        .addField('Action :', "Révoquation de bannissement", false)
        .setTimestamp()
        .setFooter(`Bannissement révoqué par ${message.author.username}.`, message.author.avatarURL());

    if (raison) {
        log.addField('Raison :', `${raison}`, true)
        embed.addField('Raison', `${raison}`, false)
    }

    client.channels.cache.get(client.config.CHANNELLOGID).send(log)

    return message.channel.send(embed);
}
module.exports.help = MESSAGES.Commandes.Moderation.UNBAN;
