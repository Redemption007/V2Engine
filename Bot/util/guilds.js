const mongoose = require('mongoose');
const Guild = require('../modeles/guild');

module.exports = client => {

    client.createGuild = async guild => {
        const merged = Object.assign({_id: new mongoose.Types.ObjectId()}, guild);
        const createGuild = await new Guild(merged);

        createGuild.save(function (err) { if (err) console.error(); })
        console.log(`Nouveau serveur : ${guild.guildName} (${guild.guildID})`);
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
        await guild.channels.cache.find(ch => ch.name.match(/(g[ée]n[ée]ral)|(t?chat)/))
            .then(general => client.updateGuild(guild, {generalChannel: general.id}))
            .catch(async () => {
                await guild.channels.fetch()
                    .then(async channels => {
                        const general = await channels.find(one => one.type === 'GUILD_TEXT' && one.isText() && one.permissionsFor(client.user).has('SEND_MESSAGES'))
                        client.updateGuild(guild, {generalChannel: general.id})
                    })
            })
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

    client.updateLeaderboard = async (member, xp) => {
        const guild = await client.getGuild(member.guild)
        let lb = guild.leaderboard
        const exchange = i => {
            const placeholder = lb[i]
            lb[i] = lb[i-1]
            lb[i-1] = placeholder
            return lb
        }
        const index = lb.findIndex(rang => rang[0]===member.id)
        if (!lb.length || index==-1) return guild.updateOne({$push: {leaderboard: [[member.id, xp]]}})
        lb[index][1]=xp
        if (lb[index]>0 && lb[index-1][1]<=lb[index][1]) exchange(index)
        if (lb[index]+1<lb.length && lb[index+1][1]>=lb[index][1]) exchange(index+1)
        return guild.updateOne({leaderboard: lb})
    }
}
