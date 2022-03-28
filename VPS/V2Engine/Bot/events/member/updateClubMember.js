const {get} = require('axios')

module.exports = async (client, guild, compteBS, groups, message, member) => {
    let still = 0
    for (let i=0; i<groups.length; i++) {
        const autre_compte = await get(`https://api.brawlstars.com/v1/players/%23${groups[i]}`, {headers: {"authorization": `Bearer ${client.config.BS_TOKEN}`}})
        if (guild.clubBS.find(cl => cl.name === autre_compte.data.club.name)) still++
    }
    const role = await message.guild.roles.cache.find(r => r.name === compteBS.data.club.name)
    if (role && !still) {
        await member.roles.remove(role.id).catch()
        return message.channel.send(`Le rôle **${role.name}** a bien été enlevé à ${member}.`)
    }
}