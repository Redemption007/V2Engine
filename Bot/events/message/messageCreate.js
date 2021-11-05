const discord = require('discord.js')

module.exports = async (client, message) => {

    if (message.author.bot) return;
    if (message.channel.type === 'DM') return client.emit('DM', message);
    const settings = await client.getGuild(message.guild)
    let dbUser = await client.getUser(message.member)

    if (!dbUser) {
        await client.createUser({
            guildIDs: [message.member.guild.id],
            userID: message.author.id,
            username: message.member.user.tag,
            dmable: true,
            xp: [0],
            level: [0]
        })
    } else {
        let index = await dbUser.guildIDs.indexOf(message.guild.id)
        if (index == -1) {
            index = await dbUser.guildIDs.length
            await client.updateUser(message.author, {$push: {guildIDs: message.guild.id, xp: 0, level: 0}})
        }
        const xpCooldown = Math.floor(Math.random()*4 +1)
        const xpToAdd = Math.floor(Math.random()*25 +10)

        if (xpCooldown === 4) await client.updateXP(message.member, message.guild.id, xpToAdd)

        const userLevel = Math.floor(0.63*Math.log(dbUser.xp[index]))

        if (dbUser.level[index] !== userLevel) {
            if (dbUser.level[index] < userLevel) message.reply(`Bravo champion, tu viens d'atteindre le niveau **${userLevel}** ! Pourras-tu faire Top 1 ?`)
            if (dbUser.level[index] > userLevel) message.reply(`Oh non ! Ton xp a été descendue à ${dbUser.xp[index]} et tu es donc descendu au niveau ${userLevel} !`)
            let userLevels = dbUser.level
            userLevels[index]=userLevel
            client.updateUser(message.member, {level: userLevels})
        }
    }

    if (!message.content.startsWith(settings.prefix)&&!message.content.startsWith(client.config.NAME)) return;

    if (message.content === `${client.config.NAME} prefix`) return message.reply({embeds: [{title: "On m'a appelé ?", color: 'GOLD', description: `Mon préfixe sur ce serveur est : \`${settings.prefix}\``}]})
    
    let long = 0;
    if (message.content.startsWith(settings.prefix)) {
        long = settings.prefix.length;
    } else {
        long = 23;
    }
    const args = message.content.slice(long).split(' ').filter(i => i!=='');
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

    if (!command) {
        setTimeout(() => message.delete().catch(), 5000)
        return message.reply({embeds: [{color: 'RED', title: 'Oups !', description: "La commande demandée est inexistante..."}]})
    }

    if (command.help.arg && !args.length) {
        let noArgsReply = `Il faut des arguments pour cette commande, ${message.author} !`;

        if (command.help.usage) {
            noArgsReply += `\nVoici comment utiliser la commande :\`${settings.prefix}${command.help.usage}\``
        }
        setTimeout(() => message.delete().catch(), 5000)
        return message.channel.send(noArgsReply);
    }

    try {
        if (command.help.Modo && !message.member.permissions.has('KICK_MEMBERS')||command.help.Admin && !message.member.permissions.has('ADMINISTRATOR')) {
            const nope = new discord.MessageEmbed()
                .setTitle("Hélas !")
                .setColor("BLACK")
                .setTimestamp()
                .setDescription(`<@${message.author.id}>, tu n'as pas les permissions nécessaires pour éxécuter cette commande !`)
            setTimeout(() => message.delete().catch(), 5000)
            return message.channel.send({embeds: [nope]});
        }

        if (command.help.isUserModo && message.mentions.members.first().permissions.has('KICK_MEMBERS')) {
            const nope = new discord.MessageEmbed()
                .setTitle("Hélaaa jeune chenapan !")
                .setColor("BLACK")
                .setTimestamp()
                .setDescription(`<@${message.author.id}>, tu ne peux pas éxécuter la commande ${command.help.name} sur un modérateur !`);
            setTimeout(() => message.delete().catch(), 5000)
            return message.channel.send({embeds: [nope]});
        }

    } catch (error) {
        if (message.mentions.users.first().id === client.user.id) return message.reply("Attends, t'as vraiment essayé de me troll là ?")
        const nope = new discord.MessageEmbed()
            .setTitle("Houla !")
            .setColor("BLACK")
            .setTimestamp()
            .setDescription(`<@${message.author.id}>, l'utilisateur ${args[0]} n'existe pas !`);
        setTimeout(() => message.delete().catch(), 5000)
        return message.channel.send({embeds: [nope]});
    }

    if (!client.cooldowns.has(command.help.name)) {
        client.cooldowns.set(command.help.name, new discord.Collection());
    }
    const timeNow = Date.now();
    const tStamps = client.cooldowns.get(command.help.name);
    const cdAmount = (command.help.cooldown || 5)*1000;

    if (tStamps.has(message.author.id)) {
        const cdExpirationTime = tStamps.get(message.author.id) + cdAmount;

        if (timeNow < cdExpirationTime) {
            const timeLeft = (cdExpirationTime - timeNow)/1000;
            let plural = 'seconde'

            if (timeLeft.toFixed(0)>1) plural+='s';
            setTimeout(() => message.delete().catch(), 5000)
            return message.reply(`Merci d'attendre ${timeLeft.toFixed(0)} ${plural} avant de ré-utiliser la commande \`${settings.prefix}${command.help.name}\`.`);
        }
    }
    tStamps.set(message.author.id, timeNow);
    setTimeout(() => tStamps.delete(message.author.id), cdAmount);

    const Chan = message.channel
    const _guild = message.guild
    dbUser = await client.getUser(message.member)
    await command.run(client, message, args, settings, dbUser);
    setTimeout(() => message.delete().catch(async () => {
        if (Chan.deleted) {
            if (Chan.id === settings.generalChannel) await client.getGeneralChannel(_guild)
        }
    }), 2000)
}
