const {MESSAGES} = require("../../starterpack/constants");
const {MessageAttachment} = require('discord.js')

module.exports.run = async (client, message, args, settings) => {
    const getSetting = args[0].toLowerCase();
    let newSetting = args.splice(1).join(' ');
    let error = 0;

    switch (getSetting) {

    case 'animationrole':
    case 'animationrôle':
        if (newSetting) {
            if (message.mentions.roles.size) newSetting = message.mentions.roles.first().id
            else {
                const role = await message.guild.roles.fetch(newSetting)
                if (!role) return message.reply(`"${newSetting}" n'est pas une réponse valable ! Merci d'indiquer un rôle valide en écrivant son ID ou en le taguant comme suit : \`<@&id>\` ou bien \`@nom\` .`)
            }
            await client.updateGuild(message.guild, {staffrole: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Rôle d\'animation mis à jour :', description: `<@&${settings.animationrole}> est remplacé par <@&${newSetting}>`}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: ` Rôle d'animation actuel : <@&${settings.animationrole}>`}]})

    case 'généralchannel':
    case 'generalchannel':
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

    case 'logchannel': 
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

    case 'muterole':
        if (newSetting) {
            if (message.mentions.roles.size) newSetting = message.mentions.roles.first().id
            else {
                await message.guild.roles.fetch(newSetting)
                    .then(role => {
                        if (role.permissions.has('SEND_MESSAGES')) error=1
                    })
                    .catch(() => error=1)
            }
            if (error) return message.reply(`"${newSetting}" n'est pas une réponse valable ! Merci d'indiquer un rôle valide en écrivant son ID ou en le taguant comme suit : \`<@&id>\` ou bien \`@nom\` . Ce rôle ne doit pas avoir la permission de parler.`)
            await client.updateGuild(message.guild, {muterole: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Rôle Mute mis à jour :', description: `<@&${settings.muterole}> est remplacé par <@&${newSetting}>`}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: ` Rôle Mute actuel : <@&${settings.muterole}>`}]})

    case 'nextlevelmessage':
        if (newSetting) {
            await client.updateGuild(message.guild, {nextLevelMessage: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Message de niveau supérieur mis à jour :', description: `\`${settings.nextLevelMessage}\` est remplacé par \`${newSetting}\``}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: `Message de niveau supérieur actuel : \`${settings.nextLevelMessage}\``}]})

    case 'préfixe':
    case 'prefixe':
    case 'préfix':
    case 'prefix':
        if (newSetting) {
            await message.delete()
            await client.updateGuild(message.guild, {prefix: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Préfixe mis à jour :', description: `\`${settings.prefix}\` est remplacé par \`${newSetting}\``}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: `Préfixe actuel : \`${settings.prefix}\``}]})

    case 'rankimage':
    case 'rangimage':
    case 'xpimage':
        if (newSetting) {
            if (!message.content.match(/^https?::\/\/.+(\.(png)|(jpg)|(jpeg))$/)) {
                if (!message.attchments.size) return message.reply('Merci de prodiguer une réponse valable : une image ou un lien d\'image.')
                const image_channel = await client.channels.fetch(client.config.IMAGE_CHANNEL)
                image_channel.send({files: message.attchments.first()})
                    .then(msg => newSetting = msg.attchments.first().url)
            }
            await message.delete()
            await client.updateGuild(message.guild, {rankImage: newSetting});
            return message.channel.send({embeds: [{color: 'ORANGE', description: `Image d'xp mise à jour avec succès ! Voici la nouvelle image :`}], files: new MessageAttachment(newSetting)})
        }
        return message.channel.send({embeds: [{color: 'ORANGE', description: `Image actuelle :`}], files: new MessageAttachment(settings.rankImage)})


    case 'staffrole':
        if (newSetting) {
            if (message.mentions.roles.size) newSetting = message.mentions.roles.first().id
            else {
                await message.guild.roles.fetch(newSetting)
                    .then(role => {
                        if (!role.permissions.has('KICK_MEMBERS')) error=1
                    })
                    .catch(() => error=1)
            }
            if (error) return message.reply(`"${newSetting}" n'est pas une réponse valable ! Merci d'indiquer un rôle valide en écrivant son ID ou en le taguant comme suit : \`<@&id>\` ou bien \`@nom\` . Ce rôle doit au moins avoir la permissions de kick les membres.`)
            await client.updateGuild(message.guild, {staffrole: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Rôle de staff mis à jour :', description: `<@&${settings.staffrole}> est remplacé par <@&${newSetting}>`}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: ` Rôle de staff actuel : <@&${settings.staffrole}>`}]})

    case 'welcomeimage':
        if (newSetting) {
            if (!message.content.match(/^https?::\/\/.+(\.(png)|(jpg)|(jpeg))$/)) {
                if (!message.attchments.size) return message.reply('Merci de prodiguer une réponse valable : une image ou un lien d\'image.')
                const image_channel = await client.channels.fetch(client.config.IMAGE_CHANNEL)
                image_channel.send({files: message.attchments.first()})
                    .then(msg => newSetting = msg.attchments.first().url)
            }
            await message.delete()
            await client.updateGuild(message.guild, {welcomeImage: newSetting});
            return message.channel.send({embeds: [{color: 'ORANGE', description: `Image de bienvenue mise à jour avec succès ! Voici la nouvelle image :`}], files: new MessageAttachment(newSetting)})
        }
        return message.channel.send({embeds: [{color: 'ORANGE', description: `Image de bienvenue actuelle :`}], files: new MessageAttachment(settings.rankImage)})

    case 'welcomemessage':
        if (newSetting) {
            await client.updateGuild(message.guild, {welcomeMessage: newSetting});

            return message.channel.send({embeds: [{color: 'GOLD', title: 'Message de bienvenue mis à jour :', description: `\`${settings.welcomeMessage}\` est remplacé par \`${newSetting}\``}]})
        }

        return message.channel.send({embeds: [{color: 'ORANGE', description: `Message de bienvenue actuel : \`${settings.welcomeMessage}\``}]})

    default: return message.channel.send({embeds: [{color: 'RED', description: ` Votre paramètre (${args[0]}) n'est pas valide.`}]})
    }
}

module.exports.help = MESSAGES.Commandes.Admin.CONFIG;
