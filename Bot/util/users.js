const mongoose = require('mongoose');
const User = require('../modeles/user');

module.exports = client => {

    client.createUser = async user => {
        const merged = Object.assign({_id: mongoose.Types.ObjectId()}, user);
        const createUser = await new User(merged);

        createUser.save()//.then(u => console.log(`\nNouvel utilisateur : ${u.username}`));
    }

    client.getUser = async user => {
        const data = await User.findOne({userID: user.id});

        if (data) return data;
    }

    client.getUsers = async guild => {
        const data = await User.find({guildID: guild.id});

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

    client.updateXP = async (member, XP) => {
        const UserToUpdate = await client.getUser(member)
        const updatedXP = await UserToUpdate.xp + XP

        await client.updateUser(member, {xp: updatedXP})
    }
}
