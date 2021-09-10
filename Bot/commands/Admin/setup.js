const {MESSAGES} = require("../../starterpack/constants");

module.exports.run = async (client, message) => {
    const msg = await message.reply('Merci de répondre aux questions suivantes, pour le bon fonctionnement du bot :')
    const footer = {text: 'Vous avez 1 minute pour répondre à chaque question :', icon_url: message.author.avatarURL()}
    const filterPrefixe = msge => {
        const sameUser = msge.author.id === message.author.id
        if (sameUser && msge.content.length > 5) msge.reply('Préfixe trop long ! Longueur maximale du préfixe : 5 caractères').then(m => {
            msge.delete()
            setTimeout(() => m.delete(), 4000)
        })
        return sameUser && msge.content.length<6
    }
    const filterChannel = msge => {
        if (msge.author.id !== message.author.id) return false
        if (msge.mentions.channels.size) {
            if (msge.guild.channels.cache.get(msge.mentions.channels.first().id)){
                if (msge.mentions.channels.first().type === 'GUILD_TEXT'||msge.mentions.channels.first().type === 'GUILD_NEWS') {
                    return true
                }
                msge.reply('Ce salon n\'est pas de type texte !').then(m => {
                    msge.delete()
                    setTimeout(m.delete(), 4000)
                })
                return false
            }
            msge.reply('Ce salon n\'est pas dans le serveur !').then(m => {
                msge.delete()
                setTimeout(() => m.delete(), 4000)
            })
            return false
        }
        if (msge.guild.channels.cache.get(msge.content) && (msge.guild.channels.cache.get(msge.content).type === 'GUILD_NEWS' || msge.guild.channels.cache.get(msge.content).type === 'GUILD_TEXT')) return true
        msge.reply('Identifiant de salon invalide ! Merci de réessayer avce un identifiant valide (ID ou mention d\'un salon textuel).').then(m => {
            msge.delete()
            setTimeout(() => m.delete(), 4000)
        })
        return false
    }
    const filterMsg = msge => msge.author.id === message.author.id
    const filterRole = msge => {
        if (msge.author.id !== message.author.id) return false
        if (msge.mentions.roles.size) {
            if (msge.guild.roles.cache.get(msge.mentions.roles.first().id)){
                if (msge.mentions.roles.first().permissions.has('KICK_MEMBERS')) {
                    return true
                }
                msge.reply('Ce rôle n\'a pas le droit de kick des personnes du serveur ! Merci de prendre un rôle qui le puisse.').then(m => {
                    msge.delete()
                    setTimeout(() => m.delete(), 4000)
                })
                return false
            }
            msge.reply('Ce rôle n\'appartient pas au serveur !').then(m => {
                msge.delete()
                setTimeout(() => m.delete(), 4000)
            })
            return false
        }
        if (msge.guild.roles.cache.get(msge.content) && msge.guild.roles.cache.get(msge.content).permissions.has('KICK_MEMBERS')) return true
        msge.reply('Identifiant de rôle invalide !').then(m => {
            msge.delete()
            setTimeout(() => m.delete(), 4000)
        })
        return false
    }
    let prefixe = '.'
    let logChannel = 'none'
    let welcomeMessage = 'none'
    let staffrole = 'none'
    let generalChannel = 'none'
    let error = 0;

    await msg.edit({embeds: [{title: 'Quel est le préfixe souhaité pour ce bot ?', footer: footer}]})
    await msg.channel.awaitMessages({filter: filterPrefixe, max: 1, idle: 60000})
        .then(async coll => {
            prefixe = coll.first().content
            await coll.first().delete()
        }).catch(() => error =1)
    if (error) return message.channel.send(`${message.author.toString()}, vous avez mis trop de temps à répondre. La procédure est donc entièrement annulée.`)

    await msg.edit({embeds: [{title: 'Quel est le salon de log de ce serveur ? (ID ou Ping)', description: `Le préfixe de ce serveur sera \`${prefixe}\``, footer: footer}]})
    await msg.channel.awaitMessages({filter: filterChannel, max: 1, idle: 60000})
        .then(async coll => {
            if (coll.first().mentions.channels.size) {
                logChannel = coll.first().mentions.channels.first().id
            } else logChannel = coll.first().content
            await coll.first().delete()
        }).catch(() => error =1)
    if (error) return message.channel.send(`${message.author.toString()}, vous avez mis trop de temps à répondre. La procédure est donc entièrement annulée.`)

    await msg.edit({embeds: [{title: 'Quel est le message de bienvenue de ce serveur ?', description: `Le salon de log de ce serveur sera <#${logChannel}>`, footer: footer}]})
    await msg.channel.awaitMessages({filter: filterMsg, max: 1, idle: 60000})
        .then(async coll => {
            welcomeMessage = coll.first().content
            await coll.first().delete()
        }).catch(() => error =1)
    if (error) return message.channel.send(`${message.author.toString()}, vous avez mis trop de temps à répondre. La procédure est donc entièrement annulée.`)

    await msg.edit({embeds: [{title: 'Quel est le rôle de Staff de ce serveur ? (ID ou Ping)', description: `Le message de bienvenue de ce serveur sera \n> :speech_balloon: ${welcomeMessage}`, footer: footer}]})
    await msg.channel.awaitMessages({filter: filterRole, max: 1, idle: 60000})
        .then(async coll => {
            if (coll.first().mentions.roles.size) {
                staffrole = coll.first().mentions.roles.first().id
            } else staffrole = coll.first().content
            await coll.first().delete()
        }).catch(() => error =1)
    if (error) return message.channel.send(`${message.author.toString()}, vous avez mis trop de temps à répondre. La procédure est donc entièrement annulée.`)

    await msg.edit({embeds: [{title: 'Quel est le salon général de ce serveur ? (ID ou Ping)', description: `Le rôle de Staff de ce serveur sera <@&${staffrole}>`, footer: footer}]})
    await msg.channel.awaitMessages({filter: filterChannel, max: 1, idle: 60000})
        .then(async coll => {
            if (coll.first().mentions.channels.size) {
                generalChannel = coll.first().mentions.channels.first().id
            } else generalChannel = coll.first().content
            await coll.first().delete()
        }).catch(() => error =1)
    if (error) return message.channel.send(`${message.author.toString()}, vous avez mis trop de temps à répondre. La procédure est donc entièrement annulée.`)

    await msg.edit({embeds: [{title: 'Informations enregistrées !', description: `• Le préfixe de ce serveur sera \`${prefixe}\`\n• Le message de bienvenue de ce serveur sera :\n> :speech_balloon: ${welcomeMessage}\n• Le rôle de Staff de ce serveur sera <@&${staffrole}>\n• Le salon général de ce serveur sera <#${generalChannel}>\n• Le salon de log de ce serveur sera <#${logChannel}>`}]})
    await client.updateGuild(message.guild, {
        prefix: prefixe,
        logChannel: logChannel,
        welcomeMessage: welcomeMessage,
        staffrole: staffrole,
        generalChannel: generalChannel
    })
    return msg.edit('Les informations ont été enregistrées ! Nous nous remercions de vos réponses.')
};

module.exports.help = MESSAGES.Commandes.Admin.SETUP;