/* eslint-disable no-multi-spaces */
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,   //ID propre à MongoDB
    guildID: String,                       //ID du serveur
    userID: String,                        //ID de l'utilisateur
    username: String,                      //Pseudo de l'utilisateur (pas du membre !)
    dmable: {                              //Si l'utilisateur a accepté les DMs du bot
        "type": Boolean,
        "default": true
    },
    xp: {                                  //xp de l'utilisateur
        "type": Number,
        "default": 0
    },
    level: {                               //Niveau de l'utilisateur
        "type": Number,
        "default": 0
    }
})

module.exports = mongoose.model('User', userSchema);
