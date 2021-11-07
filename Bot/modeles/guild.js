/* eslint-disable no-multi-spaces */
const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,                          //ID propre à MongoDB
    guildID: String,                                              //ID du serveur
    guildName: String,                                            //Nom du serveur
    prefix: {                                                     //Préfixe du serveur
        "type": String,
        "default": "."
    },
    logChannel: {                                                 //Salon de logs du serveur
        "type": String,
        "default": 'none'
    },
    generalChannel: {                                             //Salon général du serveur
        "type": String,
        "default": 'none'
    },
    welcomeMessage: {                                             //Message de bienvenue
        "type": String,
        "default": 'none'
    },
    nextLevelMessage: {                                           //Message de changement de niveau d'xp
        "type": String,
        "default": "Bravo champion, tu viens d'atteindre le niveau **{{userLevel}}** ! Pourras-tu faire Top 1 ?"
    },
    staffrole: {                                                  //Rôle de modérateur du serveur
        "type": String,
        "default": 'none'
    },
    muteRole: {                                                   //Rôle Mute du serveur
        "type": String,
        "default": 'none'
    },
    Banned: Array,                                                //Utilisateurs bannis des tournois
    leaderboard: Array                                            //Classement des xp du serveur : [[user1, xp1], [user2, xp2], etc]
})

module.exports = mongoose.model('Guild', guildSchema);
