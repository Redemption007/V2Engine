/* eslint-disable no-multi-spaces */
const mongoose = require('mongoose');

const errorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,                          //ID propre à MongoDB
    guildID: String,                                              //ID du serveur
    guildName: String,                                            //Nom du serveur
    command: String,                                              //Nom de la commande qui a causée l'erreur
    user: String,                                                 //Username + ID de l'utilisateur ayant tapé la commande
    date: Date,                                                   //Date de l'erreur
    error: String,                                                //Nom de l'erreur
    log: String,                                                  //Message d'erreur
    content: String,                                              //Contenu du message déclenchant la commande
    source: String
})

module.exports = mongoose.model('Error', errorSchema);
