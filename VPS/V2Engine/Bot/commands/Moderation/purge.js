const {MESSAGES} = require('../../starterpack/constants')
const Discord = require('discord.js');

module.exports.run = async (client, message, args, settings) => {
    try {
        if (isNaN(args[0]) || args[0]<1 || args[0]>100) {
            return message.reply(`Voici l'usage de la commande : \`purge <nombre_de_messages>\` avec le nombre compris entre 1 et 100.`);
        }
        const messages = await message.channel.messages.fetch({
            limit: Math.min(args[0], 100),
            before: message.id,
        })
        await message.channel.bulkDelete(messages, true)

        const embed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setDescription(`${args[0]} messages ont été supprimés.`)
        await message.channel.send({embeds: [embed]}).then(m => setTimeout(() => m.delete(), 3000))
        const log = new Discord.MessageEmbed()
            .setTitle("PURGE")
            .setColor("BLUE")
            .setDescription(`**__Action :__**\nPurge de ${args[0]} messages\n__Salon :__ ${message.channel}`)
            .setTimestamp()
            .setFooter(`Purge provoquée par ${message.author.username}.`, message.author.avatarURL());
        client.channels.cache.get(settings.logChannel).send({embeds: [log]})

    } catch (error) {
        const nope = new Discord.MessageEmbed()
            .setTitle("Oups...")
            .setDescription("Discord n'autorise que la supression des messages datant de moins de 2 semaines !\n\n*Envie d'un salon propre ?* Essayez la commande `nuke` !")
            .setColor("RED")

        message.channel.send({embeds: [nope]});
    }
}
module.exports.help = MESSAGES.Commandes.Moderation.PURGE;
