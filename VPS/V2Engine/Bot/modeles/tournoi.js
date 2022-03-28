/* eslint-disable no-multi-spaces */
const mongoose = require('mongoose');

const TournoiSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,                    //ID du serveur
    InscriptionsChannelID: String,      //ID du channel d'inscriptions
    StaffChannelID: String,             //ID du channel du staff
    NomduTournoi: String,               //Nom du tournoi
    Date: Date,                         //Date de début du tournoi
    Duree: {                            //Durée du tournoi
        "type": Number,
        "default": 3600000
    },
    InscriptionsDate: Date,             //Date de début des inscriptions
    InscriptionsFin: Number,            //Écart de temps entre la fin des inscriptions et le début du tournoi
    NbdeTeams: {                        //Nombre maximal d'équipes
        "type": Number,
        "default": 15
    },
    Compo: {                            //Nombre maximal de personnes par équipes
        "type": Number,
        "default": 1
    },
    Lobbys: {                           //Nombre maximal d'équipes par lobby
        "type": Number,
        "default": 2
    },
    Gagnants: {                         //Nombre de gagnants
        "type": Number,
        "default": 1
    },
    Random: {                           //Si la composition des équipes est automatique ou non
        "type": Boolean,
        "default": false
    },
    Incomplets: {                       //Si les équipes incomplètes sont autorisées
        "type": Boolean,
        "default": false
    },
    RoleTournoi: String,                //ID du rôle tournoi
    Inscrits: Array,                    //Tableau des inscrits
    NextRound: {                        //Tableau temporaire des utilisateurs passant au prochain round
        "type": Array,
        "default": []
    }
})

module.exports = mongoose.model('Tournoi', TournoiSchema);
