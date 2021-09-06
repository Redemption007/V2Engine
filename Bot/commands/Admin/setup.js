const {MESSAGES} = require("../../starterpack/constants");

module.exports.run = async (client, message) => {
    const msg = await message.reply('merci de répondre aux questions suivantes, pour le bon fonctionnement du bot :')
    const footer = {text: 'Vous avez 1 minute pour répondre à chaque question :', icon_url: message.author.avatarURL()}
    const filterPrefixe = msge => {
        const sameUser = msge.author.id === message.author.id
        if (sameUser && msge.content > 5) msge.reply('préfixe trop long ! Longueur maximale du préfixe : 5 caractères')
    }
    const filterChannel = msge => {
        if (msge.mentions.channels) {
            if (msge.guild.channels.cache.get(msge.mentions.channels.first().id)){
                if (msge.mentions.channels.first().type === 'text') {
                    return true
                }
                msge.reply('Ce salon n\'est pas de type texte !')
            }
            msge.reply('Ce salon n\'est pas dans le serveur !')
        }
        if (msge.guild.channels.cache.get(msge.content) && msge.guild.channels.cache.get(msge.content).type === 'text') return true
        if (msge.content.match(/[0-9]+/)) msge.reply('Identifiant de salon invalide !')
        return false
    }
    const filterMsg = msge => msge.author.id === message.author.id
    const filterRole = msge => {
        if (msge.mentions.roles) {
            if (msge.guild.roles.cache.get(msge.mentions.roles.first().id)){
                if (msge.mentions.roles.first().permissions.has('KICK_MEMBERS')) {
                    return true
                }
                msge.reply('Ce n\'a pas le droit de kick des personnes du serveur ! Merci de prendre un rôle qui le puisse.')
            }
            msge.reply('Ce rôle n\'appartient pas au serveur !')
        }
        if (msge.guild.roles.cache.get(msge.content) && msge.guild.roles.cache.get(msge.content).permissions.has('KICK_MEMBERS')) return true
        if (msge.content.match(/[0-9]+/)) msge.reply('Identifiant de rôle invalide !')
        return false
    }
    let prefixe = '.'
    let logChannel = 'none'
    let welcomeMessage = 'none'
    let staffrole = 'none'
    let generalChannel = 'none'

    await msg.edit({embed: {title: 'Quel est le préfixe souhaité pour ce bot ?', footer: footer}})
    await msg.channel.awaitMessages(filterPrefixe, {max: 1, idle: 60000})
        .then(coll => prefixe = coll.first().content)
    await msg.edit({embed: {title: 'Quel est le salon de log de ce serveur ? (ID ou Ping)', description: `Le préfixe de ce serveur sera \`${prefixe}\``, footer: footer}})
    await msg.channel.awaitMessages(filterChannel, {max: 1, idle: 60000})
        .then(coll => {
            if (msg.mentions.channels) logChannel = coll.first().mentions.channels.first().id
            else logChannel = coll.first().content
        })
    await msg.edit({embed: {title: 'Quel est le message de bienvenue de ce serveur ?', description: `Le salon de log de ce serveur sera <#${logChannel}>`, footer: footer}})
    await msg.channel.awaitMessages(filterMsg, {max: 1, idle: 60000})
        .then(coll => welcomeMessage = coll.first().content)
    await msg.edit({embed: {title: 'Quel est le rôle de Staff de ce serveur ? (ID ou Ping)', description: `Le message de bienvenue de ce serveur sera \n> :speech_balloon: ${welcomeMessage}`, footer: footer}})
    await msg.channel.awaitMessages(filterRole, {max: 1, idle: 60000})
        .then(coll => {
            if (msg.mentions.roles) staffrole = coll.first().mentions.roles.first().id
            else staffrole = coll.first().content
        })
    await msg.edit({embed: {title: 'Quel est le salon général de ce serveur ? (ID ou Ping)', description: `Le rôle de Staff de ce serveur sera <@&${staffrole}>`, footer: footer}})
    await msg.channel.awaitMessages(filterChannel, {max: 1, idle: 60000})
        .then(coll => {
            if (msg.mentions.channels) generalChannel = coll.first().mentions.channels.first().id
            else generalChannel = coll.first().content
        })
    await msg.edit({embed: {title: 'Informations enregistrées !', description: `Le salon général de ce serveur sera <#${generalChannel}>`}})
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