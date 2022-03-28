const Discord = require('discord.js')
const embed = require('../../commands/Utilitaires/embed')

module.exports = async (client, message) => {
    if (message.author.bot || message.content.toLowerCase() !== "ticket") return
    let msg

    await message.reply('quelle est votre question ?')
    await message.channel.awaitMessages(true, {max: 1, idle: 60000})
        .then(coll => msg = coll.first())
    const log = new Discord.MessageEmbed()
        .setTitle("Ticket")
        .setColor("WHITE")
        .setThumbnail(msg.author.avatarURL())
        .setDescription(`*Ouvert par ${msg.author} (ID : ${msg.author.id}).*`)
        .addField('__Contenu :__', `:speech_balloon: ${msg.content}`)
        .setTimestamp()
        .setFooter(`Ticket ouvert le :`, msg.author.avatarURL());

    client.channels.cache.get(client.config.CHANNELLOGID).send({embeds: [log]})
    embed.run(client, msg, 'WHITE;; Votre ticket a bien été envoyé !')
}
