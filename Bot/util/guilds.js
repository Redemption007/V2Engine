const mongoose = require('mongoose');
const Guild = require('../modeles/guild');

module.exports = client => {

    client.createGuild = async guild => {
        const merged = Object.assign({_id: mongoose.Types.ObjectId()}, guild);
        const createGuild = await new Guild(merged);

        createGuild.save()//.then(g => console.log(`\nNouveau serveur : ${g.guildName}`));
    }

    client.getGuild = async guild => {
        const data = await Guild.findOne({guildID: guild.id});

        if (data) return data;

        return client.config.DEFAULTSETTINGS;
    }

    client.updateGuild = async (guild, settings) => {
        let data = await client.getGuild(guild);

        if (typeof data !== "object") return data = {};

        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key]
        }

        return data.updateOne(settings);
    }

    client.getGeneralChannel = async Guild => {
        const guild = await client.guilds.fetch(Guild.id)
        let general = await guild.channels.cache.find(ch => ch.name.match(/(g[ée]n[ée]ral)|(t?chat)/))
        if (!general) {
            let max = 0
            for (let i = 0; i < guild.channels.length; i++) {
                if (max<guild.channels.cache[i].members.length) {
                    max = guild.channels.cache[i].members.length
                    general = guild.channels.cache[i]
                }
            }
        }
        client.updateGuild(guild, {generalChannel: general.id})
    }

    client.banGuild = async (guild, user) => {
        const banned = await guild.Banned.find(e => e === user.id)

        if (banned) return new Error()
        guild.Banned.push(user.id)

        return guild.save()
    }

    client.unbanGuild = async (guild, user) => {
        const banned = await guild.Banned.findIndex(e => e === user.id)

        if (banned === -1) return new Error()
        guild.Banned.splice(banned, 1)

        return guild.save()
    }
}
