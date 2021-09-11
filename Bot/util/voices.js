const mongoose = require('mongoose')
const Voice = require('../modeles/voice')

module.exports = client => {

    client.createVoice = async voice => {
        const merged = Object.assign({_id: new mongoose.Types.ObjectId()}, voice);
        const createVoice = await new Voice(merged);

        createVoice.save(function (err) { if (err) console.error(); })
    }

    client.getVoice = async voice => {
        const voiceChannel = await Voice.findOne(voice)

        if (voiceChannel) return voiceChannel
    }

    client.updateVoice = async (voice, settings) => {
        let data = await client.getVoice(voice);

        if (typeof data !== "object") return data = {};

        for (const key in settings) {
            if (data[key] !== settings[key]) data[key] = settings[key]
        }

        return data.updateOne(settings);
    }

    client.deleteVoice = voice => {
        return Voice.findByIdAndDelete(voice._id)
    }
}