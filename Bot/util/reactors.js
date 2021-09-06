const mongoose = require('mongoose');
const Reactor = require('../modeles/reactor');

module.exports = client => {

    client.createReactor = reactor => {
        const merged = Object.assign({_id: mongoose.Types.ObjectId()}, reactor)
        const createReactor = new Reactor(merged)

        createReactor.save()
    }

    client.getReactor = async msg => {
        const data = await Reactor.findOne({msgReactorID: msg.id});

        if (data) return data;
    }

    client.updateReactor = async (msg, settings) => {
        let data = await client.getReactor(msg)

        if (typeof data !== "object") return data = {};

        await data.typeReactor.push(settings.typeReactor)
        await data.typeAction.push(settings.typeAction)
        await data.emojis.push(settings.emojis)
        await data.channelsending.push(settings.channelsending)
        await data.autre.push(settings.autre)

        return data.save()
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

        return reactorToDelete.save()
    }
}
