const mongoose = require('mongoose');
const User = require('../modeles/user');

module.exports = client => {

    client.createUser = async user => {
        const merged = Object.assign({_id: new mongoose.Types.ObjectId()}, user);
        const createUser = await new User(merged);

        console.log(`Nouvel utilisateur : ${user.username} (${user.userID})`);
        return createUser.save(function (err) { if (err) console.error(); })
    }


    client.getUser = async user => {
        const data = await User.findOne({userID: user.id});

        if (data) return data;
    }

    client.getUsers = async guild => {
        const data = await User.find({guildID: {$all:[guild.id]}});

        if (data) return data;
    }

    client.updateUser = async (user, settings) => {
        let data = await client.getUser(user);

        if (typeof data !== "object") return data = {};

        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key]
        }

        return data.updateOne(settings);
    }

    client.updateXP = async (member, guildID, XP) => {
        const UserToUpdate = await client.getUser(member)
        const index = await UserToUpdate.guildIDs.indexOf(guildID)
        let xp = UserToUpdate.xp
        xp[index] += XP

        await client.updateUser(member, {xp: xp})
    }
}
