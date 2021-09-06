const {MESSAGES} = require('../../starterpack/constants')
const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {

    const user = message.guild.member(message.mentions.users.first());

    if (isNaN(args[1] || args[1]<1 || args[1]>100)) {
        return message.reply(`Voici l'usage de la commande : \`purge <nombre_de_messages>\` avec le nombre compris entre 1 et 100.`);
    }

    const messages = await message.channel.messages.fetch({
        limit: Math.min(args[1], 100),
        before: message.id,
    }).filter(a => a.author.id === user.id).array()

    messages.length = Math.min(args[1], messages.length)
    if (messages.length === 0) {
        return message.reply("Il n'y pas de messages de cet utilisateur dans les 100 derniers messages.")
    } else if (messages.length === 1) {
        await messages[0].delete()
    } else {
        await message.channel.bulkDelete(messages)
    }

    const embed = new Discord.MessageEmbed()
        .setColor("BLUE")
        .setDescription(`${args[1]} messages de ${user} ont été supprimés.`)

    setTimeout(() => {
        message.channel.lastMessage.delete()
    }, 3000)
    const log = new Discord.MessageEmbed()
        .setTitle("PRUNE")
        .setColor("BLUE")
        .setDescription(`**__Action :__**\nPurge de ${args[1]} messages\nUtilisateur concerné : ${user}\n__Salon :__ ${message.channel}`)
        .setTimestamp()
        .setFooter(`Prune provoquée par ${message.author.username}.`, message.author.avatarURL());

    client.channels.cache.get(client.config.CHANNELLOGID).send(log)


    return message.channel.send(embed);
}
module.exports.help = MESSAGES.Commandes.Moderation.PRUNE;
