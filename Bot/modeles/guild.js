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
    rankImage: {                                                  //Image de rang
        "type": String,
        "default": "https://cdn.discordapp.com/attachments/906726350323335189/906726565566627900/screen_mc.png"
    },
    welcomeImage: {                                               //Image de bienvenue
        "type": String,
        "default": "https://cdn.discordapp.com/attachments/906726350323335189/906944806616453130/welcome.jpg"
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
    animationrole: {
        "type": String,
        "default": 'none'
    },
    muteRole: {                                                   //Rôle Mute du serveur
        "type": String,
        "default": 'none'
    },
    Banned: Array,                                                //Utilisateurs bannis des tournois
    leaderboard: Array,                                           //Classement des xp du serveur : [[user1, xp1], [user2, xp2], etc]
    roles: Array,                                                 //Rôles données pour des animations
    groups: Array,                                                //Tableau des groupes dans lesquels les absences peuvent être annoncées
    absences: Array,                                              //Tableau des absences, peut-être absence du staff ou absence d'une équipe
    clubBS: Array,                                                //Tag du/des club(s) BS du serveur
})

module.exports = mongoose.model('Guild', guildSchema);
