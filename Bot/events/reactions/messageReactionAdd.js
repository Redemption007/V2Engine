module.exports = async (client, MessageReaction, user) => {
    if (user.bot) return
    if (MessageReaction.partial) await MessageReaction.fetch()
    if (MessageReaction.message.channel.type === 'DM'&& MessageReaction.message.embeds.length && MessageReaction.message.embeds[0].color !== 3447003) return client.emit('TeamTournoiResponse', MessageReaction, user)
    if (MessageReaction.message.channel.type === 'DM') return

    const member = MessageReaction.message.guild.members.cache.get(user.id)
    const emojiName = MessageReaction.emoji.name
    const dbUser = await client.getUser(user)
    let DMable = dbUser.dmable
    const messageReactor = await client.getReactor({id: MessageReaction.message.id})

    if (!messageReactor) return
    if (DMable === undefined) DMable = true;
    for (let i=0; i<=messageReactor.emojis.length; i++) {
        if (messageReactor.emojis[i] !== emojiName) return
        switch (messageReactor.typeReactor[i]) {
        case 'DM':
            if (!DMable) {
                if (messageReactor.typeAction[i] === 1) {
                    await MessageReaction.message.guild.channels.cache.get(messageReactor.channelsending[i]).send({content: `<@${user.id}> vous avez interdit au bot de vous DM. Voici donc les informations demandées :`, embeds: [{color: 'RED', description: `> ${messageReactor.autre[i]}`}]})
                } else {
                    await MessageReaction.message.guild.channels.cache.get(messageReactor.channelsending[i]).send(`Hélas ! <@${user.id}> vous avez interdit au bot de vous DM. Ces informations n'étant disponibles qu'en MP, merci de les activer si vous souhaitez recevoir les informations supplémentaires demandées.`)
                }
            } else {
                await member.send({embeds: [{color: 'PURPLE', title: 'Voici les informations demandées :', description: `__*Message de <#${MessageReaction.message.channel.id}>*__\n\n> ${messageReactor.autre[i]}`, footer: {text: `Vous avez réagi au message du serveur **${MessageReaction.message.guild.name}** afin de recevoir plus d'informations sur ce message.`}, timestamp: Date.now()}]}).catch(async () => {
                    switch (messageReactor.typeAction[i]) {
                    case 1:
                        await MessageReaction.message.guild.channels.cache.get(messageReactor.channelsending[i]).send({content: ` <@${user.id}> vos DM ne sont pas activés. Voici les informations demandées :`, embeds: [{color: 'YELLOW', description: `> ${messageReactor.autre[i]}`}]})
                        break
                    case 2:
                        await MessageReaction.message.guild.channels.cache.get(messageReactor.channelsending[i]).send(`Hélas ! <@${user.id}> vos DM ne sont pas activés. Merci de les activer si vous souhaitez recevoir les informations supplémentaires demandées.`)
                        break
                    case 3:
                        await MessageReaction.message.guild.channels.cache.get(messageReactor.channelsending[i]).send({embeds: [{color: 'RED', title: 'Encore un !', description: `${user.nickname} (${user.username} ; <@${user.id}>) a essayé d'obtenir des informations de ce message : https://discord.com/channels/${MessageReaction.message.guild.id}/${MessageReaction.message.channel.id}/${MessageReaction.message.id}> mais a échoué car ses DMs ne sont pas activés..`}]})
                    }
                })
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
                    const Role = await MessageReaction.message.guild.roles.cache.get(messageReactor.autre[i])
                    user.send({embeds: [{description: `Le rôle <@&${Role.name}> vous a bien été ajouté.`, color:'GOLD'}]}).catch()
                }
                break
            case 2:
                await member.roles.add(messageReactor.autre[i])
                if (DMable) {
                    const Role = await MessageReaction.message.guild.roles.cache.get(messageReactor.autre[i])

                    user.send({embeds: [{description: `Le rôle <@&${Role.name}> vous a bien été ajouté.`, color:'GOLD'}]}).catch()
                }
                break
            case 3:
                await MessageReaction.users.remove(user)
                if (!member.roles.cache.has(messageReactor.autre[i])) break
                await member.roles.remove(messageReactor.autre[i])
                if (DMable) {
                    const Role = await MessageReaction.message.guild.roles.cache.get(messageReactor.autre[i])
                    user.send({embeds: [{description: `Le rôle <@&${Role.name}> vous a bien été enlevé.`, color:'GOLD'}]}).catch()
                }
                break
            case 4:
                if (!member.roles.cache.has(messageReactor.autre[i])) break
                await member.roles.remove(messageReactor.autre[i])
                if (DMable) {
                    const Role = await MessageReaction.message.guild.roles.cache.get(messageReactor.autre[i])
                    user.send({embeds: [{description: `Le rôle <@&${Role.name}> vous a bien été enlevé.`, color:'GOLD'}]}).catch()
                }
                break
            }
            break
        }
    }
}
