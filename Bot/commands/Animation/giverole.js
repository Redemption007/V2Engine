const {MESSAGES} = require('../../starterpack/constants')
const ms = require('../../util/ms')

module.exports.run = async (client, message, args, settings) => {
    const role_to_give = settings.roles[args[1]]
    const logChannel = await message.guild.channels.fetch(settings.logChannel)
    if (!role_to_give) return message.reply('Cet id de rôle n\'existe pas ! Faites `rolelist` pour voir la liste des rôles d\'animation enregistrés.')
    const filterReaction = reac => reac.users.cache.get(message.author.id) && ['✅', '❌'].includes(reac._emoji.name)
    const filterMsg = msg => msg.author.id === message.author.id && msg.content.match(/(s(ec(onde?)?s?)?)|(m(in(utes?)?)?)|(h(ours?)?|(eures?)?)|(j(ours?)?)|(d(ays?)?)|(semaines?)|(w(eeks?))$/)
    let member
    if (args[0].match(/^[0-9]{18}$/)) {
        member = await message.guild.members.fetch(args[0])
        if (!member) return message.reply('Ce membre n\'existe pas !')
    } else {
        if (!message.mentions.members.size) return message.reply('Il vous faut mettre un ID ou mentionner un membre !')
        member = message.mentions.members.first()
    }
    const role = await message.guild.roles.fetch(role_to_give)
    if (role.permissions.has('ADMINISTRATOR')) return message.reply('Le rôle ne peut pas avoir la permission Administrateur activée !')
    const msg = await message.reply({embeds: [{color: 'GREEN', description: `Le rôle ${role} sera ajouté à ${member}. Voulez-vous que le rôle s'enlève au bout d'un laps de temps ?`}]})
    msg.react('✅')
    msg.react('❌')
    const answer = await msg.awaitReactions({filter: filterReaction, time: 10000})
    if (!answer.size || answer.first()._emoji.name === '❌') {
        msg.reactions.removeAll()
        await member.roles.add(role_to_give)
        return msg.edit('Le rôle a correctement été ajouté.')
    }
    msg.reactions.removeAll()
    const mesge = await msg.reply(`<@${message.author.id}>, merci d'indiquer le temps pendant lequel le membre aura le rôle ajouté :`)
    const time = await message.channel.awaitMessages({filter: filterMsg, idle: 20000, max: 1})
    if (!time.size) {
        await member.roles.add(role_to_give)
        await mesge.delete()
        return msg.edit('Le rôle a correctement été ajouté, pas de durée enregistrée.')
    }
    const time_ms = ms(time.first().content)
    client.clock(async (mbr, role, mesg, logCh) => {
        if (!mbr.roles.cache.has(role)) return
        let channel
        logCh? channel=logCh : channel=message.channel
        try {
            await mbr.roles.remove(role)
            return channel.send({embeds: [{color: 'ORANGE', description: `Le rôle <@&${role}> a été enlevé avec succès à ${mbr} !`}]})
        } catch {
            return channel.send({embeds: [{color: 'RED', description: `Le bot a échoué à retirer le rôle <@&${role}> à ${mbr}`}]})
        }
    }, time_ms, member, role_to_give, message, logChannel)
    await member.roles.add(role_to_give)
    await mesge.delete()
    await time.first().delete()
    msg.edit({embeds: [{color: 'BLUE', description: `Le rôle a correctement été ajouté à ${member}. Il sera enlevé dans ${ms(time_ms, true)}`}]})
}
module.exports.help = MESSAGES.Commandes.Animation.GIVEROLE;
