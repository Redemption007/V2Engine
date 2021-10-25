const mongoose = require('mongoose');
const Reactor = require('../modeles/reactor');

module.exports = client => {

    client.createReactor = async reactor => {
        const merged = Object.assign({_id: new mongoose.Types.ObjectId()}, reactor)
        const createReactor = new Reactor(merged)

        await createReactor.save(function (err) { if (err) console.error(); })
    }

    client.getReactor = async msg => {
        const data = await Reactor.findOne({msgReactorID: msg.id})

        if (data) return data;
    }

    client.getReactors = async channel => {
        const data = await Reactor.find({channelID: channel.id});

        if (data) return data;
    }

    client.getSenders = async channel => {
        const data = await Reactor.find(re => re.channelsending.includes(channel.id));

        if (data) return data;
    }

    client.updateReactor = async (msg, settings) => {
        let data = await client.getReactor(msg)

        if (typeof data !== "object") return data = {};

        for (const key in settings) {
            if (typeof data[key] == Array) {
                await data[key].push(settings[key])
            } else {
                data[key] = settings[key]
            }
        }
        return data.save(function (err) { if (err) console.error(); })
    }

    client.deleteReactor = async (msg, emojiName) => {
        if (emojiName === 'all') return Reactor.deleteOne({msgReactorID: msg})
        const reactorToDelete = await client.getReactor(msg)
        let i = await reactorToDelete.emojis.findIndex(e => e === emojiName)

        while (i !== -1) {
            await reactorToDelete.typeReactor.splice(i, 1)
            await reactorToDelete.typeAction.splice(i, 1)
            await reactorToDelete.emojis.splice(i, 1)
            await reactorToDelete.channelsending.splice(i, 1)
            await reactorToDelete.autre.splice(i, 1)

            i = await reactorToDelete.emojis.findIndex(e => e === emojiName)
        }
        if (reactorToDelete.emojis.length === 0) {
            return Reactor.deleteOne({msgReactorID: reactorToDelete.msgReactorID})
        }

        return reactorToDelete.save(function (err) { if (err) console.error(); })
    }
}
