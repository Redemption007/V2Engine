/* eslint-disable no-multi-spaces */
require('dotenv').config();
const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,                          //ID propre à MongoDB
    guildID: String,                                              //ID du serveur
    guildName: String,                                            //Nom du serveur
    prefix: {                                                     //Préfixe du serveur
        "type": String,
        "default": process.env.DEFAULTSETTINGS.prefix
    },
    logChannel: {                                                 //Salon de logs du serveur
        "type": String,
        "default": process.env.DEFAULTSETTINGS.logChannel
    },
    generalChannel: {                                             //Salon général du serveur
        "type": String,
        "default": process.env.DEFAULTSETTINGS.generalChannel
    },
    welcomeMessage: {                                             //Message de bienvenue
        "type": String,
        "default": process.env.DEFAULTSETTINGS.welcomeMessage
    },
    staffrole: {                                                  //Rôle de modérateur du serveur
        "type": String,
        "default": process.env.DEFAULTSETTINGS.staffrole
    },
    muteRole: {                                                   //Rôle Mute du serveur
        "type": String,
        "default": process.env.DEFAULTSETTINGS.muteRole
    },
    Banned: Array                                                 //Utilisateurs bannis des tournois
})

module.exports = mongoose.model('Guild', guildSchema);
