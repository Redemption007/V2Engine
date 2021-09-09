/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-return */
module.exports = async (client, MessageReaction, user) => {
    if (MessageReaction.message.channel.type === 'dm') return
    const message = MessageReaction.message
    const emojiName = MessageReaction.emoji.name
    const messageReactor = await client.getReactor(message)
    const dbUser = client.getUser(user)
    let DMable = dbUser.dmable

    if (DMable === undefined) DMable = true
    if (DMable && !user.dmChannel) {
        await user.createDM().catch(() => DMable=false)
    }
    if (messageReactor) {
        if (user.id === client.user.id) {
            return client.deleteReactor(message, emojiName)
        }
        let i = -1

        messageReactor.emojis.forEach(async () => {
            i++
            if (messageReactor.emojis[i] === emojiName && messageReactor.typeReactor[i] === 'Role') {
                switch (messageReactor.typeAction[i]) {
                case 2:
                    if (!message.member.roles.cache.has(messageReactor.autre[i])) break
                    await message.member.roles.remove(messageReactor.autre[i])
                    if (DMable) {
                        const Role = await message.guild.roles.cache.get(messageReactor.autre[i])
                        user.send({embeds: [{description: `Le rôle <@&${Role.name}> vous a bien été enlevé.`, color:'GOLD'}]}).catch(e => { return })
                    }
                    break
                case 4:
                    await message.member.roles.add(messageReactor.autre[i])
                    if (DMable) {
                        const Role = await message.guild.roles.cache.get(messageReactor.autre[i])
                        user.send({embeds: [{description: `Le rôle <@&${Role.name}> vous a bien été ajouté.`, color:'GOLD'}]}).catch(e => { return })
                    }
                    break
                }
            }
        })

    }
}

