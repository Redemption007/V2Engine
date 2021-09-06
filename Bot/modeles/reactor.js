/* eslint-disable no-multi-spaces */
const mongoose = require('mongoose');

const reactorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildID: String,                        //ID du serveur
    channelID: String,                      //ID du salon où est le message
    msgReactorID: String,                   //ID du message sur lequel on réagit
    typeReactor: Array,                     //Type de réaction - DM, Role, Ticket...
    typeAction: Array,                      //Type d'action à éxécuter
    emojis: Array,                          //Emoji déclencheur
    channelsending: {                       //Salon dans lequel envoyer un message si besoin
        "type": Array,
        "default": ['none']
    },
    autre: Array,                           //ID du rôle à mettre, contenu du DM à evoyer, catégorie dans laquelle créer le ticket...
})

module.exports = mongoose.model('Reactor', reactorSchema);
