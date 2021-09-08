const {MESSAGES} = require("../../starterpack/constants");

module.exports.run = async (client, message, args, settings) => {
    const getSetting = args[0];
    const newSetting = args.splice(1).join(' ');

    switch (getSetting) {

    case 'logChannel': {
        if (newSetting) {
            await client.updateGuild(message.guild, {logChannel: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Channel de logs mis à jour :', description: `\`${settings.logChannel}\` devient \`${newSetting}\``}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: `Channel de logs actuel : \`${settings.logChannel}\``}]})
    }

    case 'prefix': {
        if (newSetting) {
            await client.updateGuild(message.guild, {prefix: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Préfixe mis à jour :', description: `\`${settings.prefix}\` devient \`${newSetting}\``}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: `Préfixe actuel : \`${settings.prefix}\``}]})
    }

    case 'welcomeMessage': {
        if (newSetting) {
            await client.updateGuild(message.guild, {welcomeMessage: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Message de bienvenue mis à jour :', description: `\`${settings.welcomeMessage}\` devient \`${newSetting}\``}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: `Message de bienvenue actuel : \`${settings.welcomeMessage}\``}]})
    }

    case 'staffrole': {
        if (newSetting) {
            await client.updateGuild(message.guild, {staffrole: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Rôle de staff mis à jour :', description: `<@&${settings.staffrole}> devient <@&${newSetting}>`}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: ` Rôle de staff actuel : <@&${settings.staffrole}>`}]})
    }

    default: return message.channel.send({embeds: [{color: 'RED', description: ` Votre paramètre (${args[0]}) n'est pas valide.`}]})
    }
}

module.exports.help = MESSAGES.Commandes.Admin.CONFIG;
