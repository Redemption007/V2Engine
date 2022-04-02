module.exports = async (client, message) => {
    const settings = await client.getGuild(message.guild)
    let dbUser = await client.getUser(message.member)
    if (!dbUser) {
        dbUser = await client.createUser({
            guildIDs: [message.member.guild.id],
            userID: message.author.id,
            username: message.member.user.tag,
            dmable: true,
            xp: [0],
            level: [0],
            rang: [message.guild.memberCount]
        })
        await settings.updateOne({$push: {leaderboard: [[message.member.id, 0]]}})
        return dbUser
    }
    if (message.content.length<=3 || message.content.startsWith(settings.prefix)) return dbUser
    let index = await dbUser.guildIDs.indexOf(message.guild.id)
    if (index == -1) {
        index = await dbUser.guildIDs.length
        await client.updateUser(message.author, {$push: {guildIDs: message.guild.id, xp: 0, level: 0}})
    }
    const xpCooldown = Math.floor(Math.random()*4 +1)
    const xpToAdd = Math.floor(Math.random()*25 +10)

    if (xpCooldown <= 4.3 && xpCooldown >= 3.7) await client.updateXP(message.member, message.guild.id, xpToAdd)

    let userLevel = 0
    while (+client.levels[userLevel]<+dbUser.xp[index]) {
        userLevel++
    }
    userLevel--
    if (dbUser.level[index] !== userLevel) {
        if (dbUser.level[index] < userLevel && settings.nextLevelMessage.length) message.reply(await client.replaced(message, settings.nextLevelMessage)).catch(async () => message.channel.send(await client.replaced(message, settings.nextLevelMessage)))
        if (dbUser.level[index] > Math.max(userLevel, 0)) message.reply(`Oh non ! Ton expérience a été descendue et tu es donc revenu au niveau ${userLevel} !`).catch(() => message.channel.send(`Oh non ! Ton expérience a été descendue et tu es donc revenu au niveau ${userLevel} !`))
        let userLevels = dbUser.level
        /*Préparation des rôles récompense :
        const newrole = await client.getRole(message.guild, userLevel)
        const oldrole = await client.getRole(message.guild, userLevels[index])
        if (oldrole !== newrole && newrole !== 1) {
            await message.member.roles.remove(oldrole).catch()
            await message.member.roles.add(newrole).catch()
        }
        */
        userLevels[index]=userLevel
        client.updateUser(message.member, {level: userLevels})
    }
    return dbUser
}
