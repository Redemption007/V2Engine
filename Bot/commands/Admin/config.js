const {MESSAGES} = require("../../starterpack/constants");

module.exports.run = async (client, message, args, settings) => {
    const getSetting = args[0].toLowerCase();
    let newSetting = args.splice(1).join(' ');
    let error = 0;

    switch (getSetting) {


    case 'generalChannel':
    case 'généralChannel':
    case 'généralchannel':
    case 'generalchannel': {
        if (newSetting) {
            if (message.mentions.channels.size) newSetting = message.mentions.channels.first().id
            else {
                await message.guild.channels.fetch(newSetting)
                    .then(chan => {
                        if (chan.type !== 'GUILD_TEXT'&&chan.type !== 'GUILD_NEWS') error=1
                    })
                    .catch(() => error=1)
            }
            if (error) return message.reply(`"${newSetting}" n'est pas une réponse valable ! Merci d'indiquer un salon valide en écrivant son ID ou en le taguant comme suit : \`<#id>\` ou bien \`#nom\``)
            await client.updateGuild(message.guild, {generalChannel: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Channel général mis à jour :', description: `<#${settings.generalChannel}> est remplacé par <#${newSetting}>`}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: `Channel général actuel : <#${settings.generalChannel}>`}]})
    }

    case 'logchannel': {
        if (newSetting) {
            if (message.mentions.channels.size) newSetting = message.mentions.channels.first().id
            else {
                await message.guild.channels.fetch(newSetting)
                    .then(chan => {
                        if (chan.type !== 'GUILD_TEXT'&&chan.type !== 'GUILD_NEWS') error=1
                    })
                    .catch(() => error=1)
            }
            if (error) return message.reply(`"${newSetting}" n'est pas une réponse valable ! Merci d'indiquer un salon valide en écrivant son ID ou en le taguant comme suit : \`<#id>\` ou bien \`#nom\``)
            await client.updateGuild(message.guild, {logChannel: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Channel de logs mis à jour :', description: `<#${settings.logChannel}> est remplacé par <#${newSetting}>`}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: `Channel de logs actuel : <#${settings.logChannel}>`}]})
    }

    case 'muterole': {
        if (newSetting) {
            if (message.mentions.roles.size) newSetting = message.mentions.roles.first().id
            else {
                await message.guild.roles.fetch(newSetting)
                    .then(role => {
                        if (role.permissions.has('SEND_MESSAGES')) error=1
                    })
                    .catch(() => error=1)
            }
            if (error) return message.reply(`"${newSetting}" n'est pas une réponse valable ! Merci d'indiquer un rôle valide en écrivant son ID ou en le taguant comme suit : \`<@!id>\` ou bien \`@nom\` . Ce rôle ne doit pas avoir la permission de parler.`)
            await client.updateGuild(message.guild, {muterole: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Rôle Mute mis à jour :', description: `<@&${settings.muterole}> est remplacé par <@&${newSetting}>`}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: ` Rôle Mute actuel : <@&${settings.muterole}>`}]})
    }

    case 'préfixe':
    case 'prefixe':
    case 'préfix':
    case 'prefix': {
        if (newSetting) {
            await message.delete()
            await client.updateGuild(message.guild, {prefix: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Préfixe mis à jour :', description: `\`${settings.prefix}\` est remplacé par \`${newSetting}\``}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: `Préfixe actuel : \`${settings.prefix}\``}]})
    }

    case 'staffrole': {
        if (newSetting) {
            if (message.mentions.roles.size) newSetting = message.mentions.roles.first().id
            else {
                await message.guild.roles.fetch(newSetting)
                    .then(role => {
                        if (!role.permissions.has('KICK_MEMBERS')) error=1
                    })
                    .catch(() => error=1)
            }
            if (error) return message.reply(`"${newSetting}" n'est pas une réponse valable ! Merci d'indiquer un rôle valide en écrivant son ID ou en le taguant comme suit : \`<@!id>\` ou bien \`@nom\` . Ce rôle doit au moins avoir la permissions de kick les membres.`)
            await client.updateGuild(message.guild, {staffrole: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Rôle de staff mis à jour :', description: `<@&${settings.staffrole}> est remplacé par <@&${newSetting}>`}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: ` Rôle de staff actuel : <@&${settings.staffrole}>`}]})
    }

    case 'welcomemessage': {
        if (newSetting) {
            await client.updateGuild(message.guild, {welcomeMessage: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Message de bienvenue mis à jour :', description: `\`${settings.welcomeMessage}\` est remplacé par \`${newSetting}\``}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: `Message de bienvenue actuel : \`${settings.welcomeMessage}\``}]})
    }

    default: return message.channel.send({embeds: [{color: 'RED', description: ` Votre paramètre (${args[0]}) n'est pas valide.`}]})
    }
}

module.exports.help = MESSAGES.Commandes.Admin.CONFIG;
