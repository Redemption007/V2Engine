/* eslint-disable no-multi-spaces */
const mongoose = require('mongoose');
const {DEFAULTSETTINGS: defaults} =require('../starterpack/parametres');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,       //ID propre à MongoDB
    guildID: String,                           //ID du serveur
    guildName: String,                         //Nom du serveur
    prefix: {                                  //Préfixe du serveur
        "type": String,
        "default": defaults.prefix
    },
    logChannel: {                              //Salon de logs du serveur
        "type": String,
        "default": defaults.logChannel
    },
    generalChannel: {                          //Salon général du serveur
        "type": String,
        "default": defaults.generalChannel
    },
    welcomeMessage: {                          //Message de bienvenue
        "type": String,
        "default": defaults.welcomeMessage
    },
    staffrole: {                               //Rôle de modérateur du serveur
        "type": String,
        "default": defaults.staffrole
    },
    muteRole: {                                //Rôle Mute du serveur
        "type": String,
        "default": defaults.muteRole
    },
    Banned: Array                              //Utilisateurs bannis des tournois
})

module.exports = mongoose.model('Guild', guildSchema);
