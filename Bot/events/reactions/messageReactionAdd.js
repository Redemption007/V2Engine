/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-return */
const {MessageEmbed} = require('discord.js')

module.exports = async (client, MessageReaction, user) => {
    if (MessageReaction.partial) await MessageReaction.fetch()
    if (MessageReaction.me) return
    if (MessageReaction.message.channel.type === 'dm'&& MessageReaction.message.embeds.length && MessageReaction.message.embeds[0].color !== 3447003) return client.emit('TeamTournoiResponse', MessageReaction, user)
    if (MessageReaction.message.channel.type === 'dm') return

    const message = MessageReaction.message
    const member = message.guild.members.cache.get(user.id)
    const emojiName = MessageReaction.emoji.name
    const dbUser = client.getUser(user)
    let DMable = dbUser.dmable
    const messageReactor = await client.getReactor(message)

    if (DMable === undefined) DMable = true;
    if (messageReactor) {
        let i = -1

        messageReactor.emojis.forEach(async () => {
            i++
            if (messageReactor.emojis[i] === emojiName) {
                switch (messageReactor.typeReactor[i]) {
                case 'DM':
                    if (!DMable) {
                        if (messageReactor.typeAction[i] === 2 || messageReactor.typeAction[i] === 3) {
                            await MessageReaction.message.guild.channels.cache.get(messageReactor.channelsending[i]).send(`Hélas ! <@${user.id}> vous avez interdit au bot de vous DM. Ces informations n'étant disponibles qu'en MP, merci de les activer si vous souhaitez recevoir les informations supplémentaires demandées.`)
                        }
                        if (messageReactor.typeAction[i] === 1) {
                            await MessageReaction.message.guild.channels.cache.get(messageReactor.channelsending[i]).send({content: `<@${user.id}> vous avez interdit au bot de vous DM. Voici donc les informations demandées :`, embeds: [{color: 'RED', description: `> ${messageReactor.autre[i]}`}]})
                        }
                    }
                    try {
                        const DM = new MessageEmbed()
                            .setColor('PURPLE')
                            .setTitle(`Voici les informations demandées :`)
                            .setFooter(`Vous avez réagi au message du serveur **${MessageReaction.message.guild.name}** afin de recevoir plus d'informations sur ce message.`)
                            .setTimestamp()
                            .setDescription(`__*Message de <#${MessageReaction.message.channel.id}>*__\n\n> ${messageReactor.autre[i]}`)

                        await member.send(DM)
                    } catch (e) {
                        if (messageReactor.typeAction[i] === 2) {
                            await MessageReaction.message.guild.channels.cache.get(messageReactor.channelsending[i]).send(`Hélas ! <@${user.id}> vos DM ne sont pas activés. Merci de les activer si vous souhaitez recevoir les informations supplémentaires demandées.`)
                        }
                        if (messageReactor.typeAction[i] === 1) {
                            await MessageReaction.message.guild.channels.cache.get(messageReactor.channelsending[i]).send({content: ` <@${user.id}> vos DM ne sont pas activés. Voici les informations demandées :`, embeds: [{color: 'YELLOW', description: `> ${messageReactor.autre[i]}`}]})
                        }
                        if (messageReactor.typeAction[i] === 3) {
                            await MessageReaction.message.guild.channels.cache.get(messageReactor.channelsending[i]).send({embeds: [{color: 'RED', title: 'Encore un !', description: `${user.nickname} (${user.username} ; <@${user.id}>) a essayé d'obtenir des informations de ce message : https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}> mais a échoué car ses DMs ne sont pas activés..`}]})
                        }
                    }
                    await MessageReaction.users.remove(user)
                    break
                case 'Role':
                    switch (messageReactor.typeAction[i]) {
                    case 1:
                        await MessageReaction.users.remove(user)
                        if (member.roles.cache.has(messageReactor.autre[i])) break
                        await member.roles.add(messageReactor.autre[i])
                        if (DMable) {
                            const Role = await message.guild.roles.cache.get(messageReactor.autre[i])

                            user.send({embeds: [{description: `Le rôle <@&${Role.name}> vous a bien été ajouté.`, color:'GOLD'}]}).catch(e => { return })
                        }
                        break
                    case 2:
                        await member.roles.add(messageReactor.autre[i])
                        if (DMable) {
                            const Role = await message.guild.roles.cache.get(messageReactor.autre[i])

                            user.send({embeds: [{description: `Le rôle <@&${Role.name}> vous a bien été ajouté.`, color:'GOLD'}]}).catch(e => { return })
                        }
                        break
                    case 3:
                        await MessageReaction.users.remove(user)
                        if (!member.roles.cache.has(messageReactor.autre[i])) break
                        await member.roles.remove(messageReactor.autre[i])
                        if (DMable) {
                            const Role = await message.guild.roles.cache.get(messageReactor.autre[i])

                            user.send({embeds: [{description: `Le rôle <@&${Role.name}> vous a bien été enlevé.`, color:'GOLD'}]}).catch(e => { return })
                        }
                        break
                    case 4:
                        if (!member.roles.cache.has(messageReactor.autre[i])) break
                        await member.roles.remove(messageReactor.autre[i])
                        if (DMable) {
                            const Role = await message.guild.roles.cache.get(messageReactor.autre[i])

                            user.send({embeds: [{description: `Le rôle <@&${Role.name}> vous a bien été enlevé.`, color:'GOLD'}]}).catch(e => { return })
                        }
                        break
                    }
                    break
                }
            }
        })
    }
}
