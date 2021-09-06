const {MessageEmbed} = require('discord.js');

module.exports = async (client, member) => {
    const log = new MessageEmbed()
        .setAuthor(`${member.user.tag} a rejoint le serveur.`, member.user.displayAvatarURL())
        .setDescription(`Utilisateur : <@${member.id}>\nID : ${member.id}`)
        .setColor('GREEN')
        .setTimestamp()

    await member.send({embed: {title: 'Bienvenue à toi !', color: 'GREEN', description: `Bonjour <@${member.id}> !\nBienvenue dans le serveur ${member.guild.name}.`}})
        .catch(() => log.setFooter(`Je n'ai pas réussi à joindre par DM l'utilisateur ${member.user.tag} pour son arrivée sur le serveur.`))
    client.channels.cache.get(client.config.CHANNELLOGID).send(log)
        
    const dbUser = await client.getUser(member)

    if (!dbUser) {
        await client.createUser({
            guildID: member.guild.id,
            guildName: member.guild.name,
            userID: member.id,
            username: member.user.tag,
            dmable: true,
            xp: 0,
            level: 0
        })
    }
    /*
    const Lverif = member.guild.verificationLevel
    let time = 300000

    switch (Lverif) {
    case 'MEDIUM':
        if (member.createdTimestamp + 300000 > Date.now()) time*=2
        break
    case 'HIGH':
        if (member.createdTimestamp + 600000 > Date.now()) time*=3
        break
    }
    client.clock(async mbr => {
        if (!mbr.lastMessage) {
            const settings = await client.getGuild(member.guild)
            member.guild.channels.cache.get(settings.generalChannel).send(`On dit bonjour quand on arrive, <@${mbr.id}>.`)
        }
    }, time, member)
    */
}
