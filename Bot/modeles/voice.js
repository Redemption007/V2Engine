/* eslint-disable no-multi-spaces */
const mongoose = require('mongoose');

const voiceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,                          //ID du serveur
    voiceID: String,                          //ID du voiceChannel générateur
    limit: {                                  //Limite d'utilisateurs des voicechannel créés
        "type": Number,
        "default": 5
    },
    name: {                                   //Nom du salon créé lors de la connexion d'un utilisateur
        "type": String,
        "default": 'Salon de {user}'
    }
})

module.exports = mongoose.model('Voice', voiceSchema);
