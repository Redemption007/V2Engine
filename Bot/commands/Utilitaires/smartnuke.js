/* eslint-disable no-multi-spaces */
/* eslint-disable no-extra-parens */
/* eslint-disable no-nested-ternary */
const {MESSAGES} = require('../../starterpack/constants')
const Tournoi = require('../../modeles/tournoi');
const Reactor = require('../../modeles/reactor');

module.exports.run = async (client, message, args) => {
    let oldchannel = message.guild.channels.cache.get(message.channel.id)
    if (args.length) {
        oldchannel = await client.getObjectOf(args[1], 'channel', message.guild)
        if (!oldchannel) return message.reply('salon invalide !')
    }
    if (message.guild.publicUpdatesChannelID === oldchannel.id) return message.reply("le bot est incapable de supprimer ce salon car celui-ci est un salon de mises à jour de communauté (voir **Paramètres du serveur** > Onglet __Communauté__ > **Vue d'ensemble**).")
    if (message.guild.rulesChannelID === oldchannel.id) return message.reply("le bot est incapable de supprimer ce salon car celui-ci est un salon de règlement de communauté (voir **Paramètres du serveur** > Onglet __Communauté__ > **Vue d'ensemble**).")
    if (oldchannel.deleted) return message.reply("le bot est incapable de supprimer ce salon car celui-ci est déjà supprimé : Discord peut mettre du temps à répondre pour la suppression d'un salon, et ainsi causer des erreurs.")
    if (!oldchannel.deletable) return message.reply("le bot est incapable de supprimer ce salon car il n'a pas les permissions pour supprimer ce salon (si le bot n'est pas administrateur, pensez à vérifier les permissions du rôle attribué au bot).")
    const newchannel = await oldchannel.clone({reason: "Nuke du channel 1/2"})
    newchannel.setPosition(oldchannel.position)
    const Server = await client.getGuild(message.guild)
    // console.log('Server = ', Server || 'Aucun !');
    // console.log('Server.logChannel === oldchannel.id :', Server.logChannel === oldchannel.id);
    if (Server.logChannel === oldchannel.id) {
        await client.updateGuild(message.guild, {logChannel: newchannel.id})
        console.log("Channel de logs redéfini !");
    }
    // console.log('Server.generalChannel === oldchannel.id :', Server.generalChannel === oldchannel.id);
    if (Server.generalChannel === oldchannel.id) {
        await client.updateGuild(message.guild, {generalChannel: newchannel.id})
        console.log("Channel général redéfini !");
    }                                                                                        //SO FAR SO GOOD
    //On check s'il y a des réacteurs dans le salon qu'on va supprimer
    //                                                          MongooseError: Query was already executed: Reactor.find({})
    //                                                          Il faut supprimer le await, mais comment faire ? Voir conversation sur github
    const reactors = await Reactor.find({channelID: oldchannel.id})
    console.log('reactors = ', await reactors || 'Aucun !');
    let reactors_length = reactors.length
    console.log(`\nIl y a ${reactors_length} réacteurs à modifier !`);
    if (reactors_length) {
        console.log('Epinglage des réacteurs :');
        //Si oui, on les épingle tous quand ils ne sont pas épinglés
        for(let i=0; i<reactors_length; i++) {
            const msgReactor = await oldchannel.messages.fetch(reactors[i].msgReactorID)
                .catch(async () => {
                    await client.deleteReactor(reactors[i].msgReactorID, 'all')
                    reactors_length--
                    i--
                })
            if (!msgReactor.pinned) {
                await msgReactor.pin()
                console.log(`Réacteur n°${i+1}/${reactors_length} déjà épinglé !`);
            } else {
                console.log(`Réacteur n°${i+1}/${reactors_length} épinglé !`);
            }
        }
    }//                                                                                                                                                        OK !!!!
    // Ensuite on checke les tournois, et si le channel est un channel de tournoi, on change l'id dans la DB, et on ré-envoie les informations dans le channel.
    const tournois = await Tournoi.find(t => t && t.guildID === message.guild.id)
    // console.log('tournois = ', tournois || 'Aucun !');
    if (tournois) { //Ceci marche j'ai l'impression, à vérifier une fois les réacteurs finis
        for (let i=0; i<tournois.length; i++) {
            if (tournois[i].InscriptionsChannelID === oldchannel.id) {
                tournois[i].InscriptionsChannelID = newchannel.id
                console.log('Channel d\'inscriptions redéfini !');
                await tournois[i].save()
            } else if (tournois[i].StaffChannelID === oldchannel.id) {
                tournois[i].StaffChannelID = newchannel.id
                console.log('Channel du staff redéfini !');
                await tournois[i].save()
            }
        }
    }
    //On prend tous les messages épinglés du salon qui va être supprimé et on les envoie chronologiquement dans le nouveau salon.
    let pinnedMessages = await oldchannel.messages.fetchPinned()
    console.log('pinnedMessages = ', pinnedMessages || 'Aucun !');
    const keys = await pinnedMessages.keys()
    console.log(`\nIl y a ${pinnedMessages.size} messages épinglés !`);
    for (let i=pinnedMessages.size-1; i>=0; i--) {
        let options = {}
        let theOne = pinnedMessages.get(keys.next().value)
        theOne.embeds
            ?theOne.attachments
                ?options = {attachments: theOne.attachments, embeds: theOne.embeds}
                : options = {embeds: theOne.embeds}
            : options = {} //On modifie les options pour renvoyer la totalité des messages épinglés (contenu+PJ+embeds)
        const contenu = {content: (theOne.author.bot?'' : `> Auteur : ${theOne.author.username}#${theOne.author.discriminator} (ID : \`${theOne.author.id}\`)\n\n`)+theOne.content}
        let newmsg
        if (!contenu.content.length) {
            newmsg = await newchannel.send(options)
        } else {
            newmsg = await newchannel.send({...contenu, ...options})
        }
        await newmsg.pin() //Ceci marche of course
        if (reactors_length) {
            console.log(`Il reste ${reactors_length} réacteurs à modifier...`);
            //Ce code marche !
            const reac = await reactors.find(r => r.msgReactorID === theOne.id)
            if (reac) {
                console.log(`Et le message épinglé n°${i} en est un !`);
                await client.updateReactor({id: theOne.id}, {msgReactorID: newmsg.id})
                for (let j=0; j<reac.emojis.length; j++) {
                    await newmsg.react(reac.emojis[j])
                }
                reactors_length--
            }
        }
    }
    console.log("Il n'y a plus de messages épinglés à envoyer, ni de réacteurs à modifier.\n");
    let senders = await Reactor.find({guildID: oldchannel.guild.id})
    senders = await senders.filter(re => re.channelsending.includes(oldchannel.id))
    console.log('senders = ', senders || 'Aucun !');
    if (senders.length) {
        console.log('\nModification de l\'envoi d\'informations des réacteurs');
        for (let j=0; j<senders.length; j++) {
            let newArray = senders[j].channelsending
            const index = await newArray.indexOf(oldchannel.id)
            newArray[index] = newchannel.id
            await client.updateReactor({id: senders[j].msgReactorID}, {channelsending: newArray})
            console.log(`Sender n°${j+1}/${senders.length} modifié !`);
        }
        console.log("Tous les senders ont été modifiés avec succès.");
    }
    //Enfin, on supprime le salon
    oldchannel.delete('Nuke du channel 2/2')
    await newchannel.messages.cache.forEach(e => { if(e.system) e.delete() }) //Ceci marche :)
    console.log("\nCommande terminée avec succès ! Félicitations mon Général !");
}
module.exports.help = MESSAGES.Commandes.Utilitaires.SMARTNUKE;
