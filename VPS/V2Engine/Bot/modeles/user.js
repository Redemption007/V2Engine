/* eslint-disable no-multi-spaces */
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,   //ID propre à MongoDB
    guildIDs: Array,                       //ID du serveur
    userID: String,                        //ID de l'utilisateur
    username: String,                      //Pseudo de l'utilisateur (pas du membre !)
    dmable: {                              //Si l'utilisateur a accepté les DMs du bot
        "type": Boolean,
        "default": true
    },
    xp: {                                  //xp de l'utilisateur
        "type": Array,
        "default": [0]
    },
    level: {                               //Niveau de l'utilisateur
        "type": Array,
        "default": [0]
    },
    comptes: Array,                          //Tags BS si l'utilisateur a enregistré un ou plusieurs comptes
})

module.exports = mongoose.model('User', userSchema);
