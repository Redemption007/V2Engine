const discord = require('discord.js');

module.exports = async (client, message) => {

    if (message.author.bot) return;
    if (message.guild.id === '776429325838319616' && client.user.id==='705476031162613790') return
    //Cette ligne évite au bot de répondre sur le serveur de test, quand on attend seulement une réponse du bot test, lancé avec le même code.

    if (message.channel.type === 'DM') return client.emit('DM', message);
    const settings = await client.getGuild(message.guild)
    if (message.content === settings.prefix) return
    const deleteerror = err => {
        return '\t\t-----------------------------------------------------\n\t\t\tERREUR lors de la suppression du message de la commande :\n\n' + err + '\n\t\t-----------------------------------------------------'
    }
    const Chan = message.channel
    const _guild = message.guild
    const deleteWithoutError = () => {
        if (Chan.deleted && Chan.id === settings.generalChannel) return client.getGeneralChannel(_guild)
        if (message.deleted) return
        message.delete().catch(err => console.log(deleteerror(err)))
    }
    
    const dbUser = await client.emit('gainxp', message)

    if (!message.content.startsWith(settings.prefix)&&!message.content.startsWith(client.config.NAME)) return;
    if (message.content===';-;') return

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
        setTimeout(() => {
            return deleteWithoutError()
        }, 5000)
        return message.reply({embeds: [{color: 'RED', title: 'Oups !', description: "La commande demandée est inexistante..."}]})
    }

    try {
        if (command.help.isUserModo && message.mentions.users.first().id === client.user.id) return message.reply("Attends, t'as vraiment essayé de me troll là ?")
        if (command.help.Modo && !message.member.permissions.has('KICK_MEMBERS')||command.help.Admin && !message.member.permissions.has('ADMINISTRATOR')||command.help.Animation && !message.member.permissions.has('ADMINISTRATOR') && !message.member.roles.cache.has(settings.animationrole)) {
            const nope = new discord.MessageEmbed()
                .setTitle("Hélas !")
                .setColor("BLACK")
                .setTimestamp()
                .setDescription(`<@${message.author.id}>, tu n'as pas les permissions nécessaires pour éxécuter cette commande !`)
            setTimeout(() => {
                return deleteWithoutError()
            }, 5000)
            return message.channel.send({embeds: [nope]});
        }

        if (command.help.isUserModo && message.mentions.members.first().permissions.has('KICK_MEMBERS')) {
            const nope = new discord.MessageEmbed()
                .setTitle("Hélaaa jeune chenapan !")
                .setColor("BLACK")
                .setTimestamp()
                .setDescription(`<@${message.author.id}>, tu ne peux pas éxécuter la commande ${command.help.name} sur un modérateur !`);
            setTimeout(() => {
                return deleteWithoutError()
            }, 5000)
            return message.channel.send({embeds: [nope]});
        }

    } catch (error) {
        const nope = new discord.MessageEmbed()
            .setTitle("Houla !")
            .setColor("BLACK")
            .setTimestamp()
            .setDescription(`<@${message.author.id}>, l'utilisateur ${args[0]} n'existe pas !`);
        setTimeout(() => {
            if (message.deleted) return
            message.delete().catch(err => console.log(deleteerror(err)))
        }, 5000)
        return message.channel.send({embeds: [nope]});
    }

    if (command.help.arg && !args.length) {
        let noArgsReply = `Il faut des arguments pour cette commande, ${message.author} !`;

        if (command.help.usage) {
            noArgsReply += `\nVoici comment utiliser la commande :\`${settings.prefix}${command.help.usage}\``
        }
        setTimeout(() => {
            return deleteWithoutError()
        }, 5000)
        return message.channel.send(noArgsReply);
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
            setTimeout(() => {
                return deleteWithoutError()
            }, 5000)
            return message.reply(`Merci d'attendre ${timeLeft.toFixed(0)} ${plural} avant de ré-utiliser la commande \`${settings.prefix}${command.help.name}\`.`);
        }
    }
    tStamps.set(message.author.id, timeNow);
    setTimeout(() => tStamps.delete(message.author.id), cdAmount);

    await command.run(client, message, args, settings, dbUser).catch(async err => {
        const id = await client.createError({
            guildID: message.guild.id,
            guildName: message.guild.name,
            command: command.help.name,
            user: `${message.author.tag} (${message.author.id})`,
            date: new Date(Date.now()),
            content: message.content.slice(long).split(' ').filter(i => i!=='').join(" "),
            error: err.message,
            log: err.toString(),
            source: err.stack
        })
        return message.channel.send(`${message.author}, le bot a rencontré une erreur ! Merci de bien vouloir contacter l'owner du bot et de lui donner le code suivant : \`${id}\``)
    })
    setTimeout(() => {
        return deleteWithoutError()
    }, 2000)
}
