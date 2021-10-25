const {MessageEmbed} = require('discord.js');

module.exports = (client, member) => {
    const log = new MessageEmbed()
        .setAuthor(`${member.user.tag} a quitté le serveur.`, member.user.displayAvatarURL())
        .setDescription(`Utilisateur : <@${member.id}>\nID : ${member.id}`)
        .setColor('RED')
        .setTimestamp()

    client.channels.cache.get(client.config.CHANNELLOGID).send({embeds: [log]})
}
