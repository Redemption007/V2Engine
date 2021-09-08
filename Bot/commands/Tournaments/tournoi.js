/* eslint-disable no-case-declarations */
const {MESSAGES} = require('../../starterpack/constants')
const ms = require('../../../../ms')

module.exports.run = async (client, message, _args, settings) => {

    const canceled = 'La commande a été annulée.'
    const warning = "Attention ! Le bot va poser une série de questions. Vous aurez 30 secondes pour répondre à chacune. Au delà de cette limite, la commande sera annulée, et vous devrez recommencer."
    const next = 'Prochaine étape :'
    const filterMsg = msg => msg.author.id === message.author.id
    const filterDuree = msg => msg.content.match(/^(-?(?:\d+)?\.?\d+) *(mill?isecondes?|msecs?|ms|secondes?|secs?|s|minutes?|mins?|m|heures?|hrs?|h|d|days?|jours?|j|semaines?|weeks?|w|anné?e+s?|ans?|a|years?|yrs?|y)?$/i)
    const filterNumber2a60 = msg => msg.author.id === message.author.id && msg.content.match(/^cancel|0?[2-9]|[1-5][0-9]|60$/i)
    const filterNumber1a30 = msg => msg.author.id === message.author.id && msg.content.match(/^cancel|[0-2]?[1-9]|[1-3]0$/i)
    const filterNumber1a10 = msg => msg.author.id === message.author.id && msg.content.match(/^cancel|[1-9]|10$/i)
    const filterReaction = reaction => reaction.users.cache.get(message.author.id) && !reaction.me
    const filterDate = msg => msg.content.match(/^cancel|((le|à|a)? *[0-9]{1,2} *( +|h|\/|:) *[0-9]{1,2})$/i)
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
    const mtn = new Date(Date.now())
    const date = new Date()
    const datedebutinsc = new Date()
    const staffid = await settings.staffrole
    let nomdutournoi = ''
    let CP = ''
    let duration = 3600000
    let fin = 0
    let nbteam = 0
    let compo = 0
    let random = false
    let incomplets = false
    let complet = '\n:warning: Équipes incomplètes __non__ autorisées'
    let deroulement = ''
    let room = 2
    let winners = 1
    let validation;
    let parentid;
    let roleTournoi;
    let positions;
    let InscriptionsChannel;
    let StaffChannel;
    let InfosChannel;
    let msg

    await message.channel.send({content: warning, embeds: [{color: 'DARK_GREEN', title: 'La commande a été validée !', description: 'Quel sera le nom du tournoi ?'}]})
        .then(mesg => msg = mesg)
        .catch(() => {
            return message.reply('Le bot a rencontré une erreur d\'API. Merci de réessayer.')
        })
    try {
        await message.channel.awaitMessages(filterMsg, {max: 1, idle: 30000, errors: 'time'})
            .then(async coll => {
                nomdutournoi = await coll.first().content
                if (nomdutournoi.toLowerCase() === 'cancel') throw new Error(canceled)
                coll.first().delete()
            })
        await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Nom du tournoi validé !', description: `Le nom du tournoi sera ${nomdutournoi}`, fields: [{name: next, value: 'Quel est le prix à remporter du tournoi ?'}]}]})
        await message.channel.awaitMessages(filterMsg, {max: 1, idle: 30000, errors: 'time'})
            .then(coll => {
                CP = coll.first().content
                if (CP.toLowerCase() === 'cancel') throw new Error(canceled)
                coll.first().delete()
            })
        await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Prix validé !', description: `Le prix de votre tournoi sera : ${CP}`, fields: [{name: next, value: 'Quand le tournoi se déroulera-t-il ?\n__Format :__ `Le Jour/Mois`\n__Exemples :__ `Le 09/08` ou `le 01 01`'}]}]})
        await message.channel.awaitMessages(filterDate, {max: 1, idle: 30000, errors: 'time'})
            .then(async coll => {
                let time = await coll.first().content.toLowerCase()

                if (time[0] === 'cancel') throw new Error(canceled)
                time = time.replace(/le|à|a|h|:| +|\//ig, ' ').trim().split(' ')
                date.setFullYear(mtn.getFullYear());
                date.setMonth(+time[1]-1);
                date.setDate(+time[0]);
                coll.first().delete()
            })
        await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Date validée !', description: 'Quelle sera l\'heure du début du tournoi ?\n__Format :__ `Heures:Minutes`\n__Exemples :__ `A 09h08` ou `à 01 01`'}]})
        await message.channel.awaitMessages(filterDate, {max: 1, idle: 30000, errors: 'time'})
            .then(async coll => {
                let debut = await coll.first().content.toLowerCase()

                if (debut === 'cancel') throw new Error(canceled)
                debut = debut.replace(/le|à|a|h|:| +|\//ig, ' ').trim().split(' ')
                date.setFullYear(mtn.getFullYear());
                date.setMinutes(+debut[1]);
                date.setHours(+debut[0]);
                date.setSeconds(0)
                coll.first().delete()
            })
        await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Date du tournoi validée !', description: `La date de votre tournoi a été enregistrée !\nVotre tournoi se déroulera le ${date.toLocaleTimeString('fr-FR', options)}`, fields: [{name: next, value: 'Entrez la durée de votre tournoi : (durée par défaut : 1h)\n__Format requis :__ `nb[j/h/m/s]`\n__Exemples :__ `1h` ou `37 minutes` ou `90min`'}]}]})
        await message.channel.awaitMessages(filterDuree, {max: 1, idle: 30000, errors: 'time'})
            .then(coll => {
                if (coll.first().content.toLowerCase() === 'cancel') throw new Error(canceled)
                duration = ms(coll.first().content)
                coll.first().delete()
            })
        if (duration === undefined) duration = 3600000
        await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Durée validée !', description: `La durée de votre tournoi est de ${ms(duration, true)}.`, fields: [{name: next, value: `Quand commenceront les inscriptions ? (Avant le ${date.toLocaleTimeString('fr-FR', options)})\n__Format :__ \`Le Jour/Mois\`\n__Exemples :__ \`Le 09/08\` ou \`le 01/01\``}]}]})
        await message.channel.awaitMessages(filterDate, {max: 1, idle: 30000, errors: 'time'})
            .then(async coll => {
                let debutinsc = await coll.first().content.toLowerCase()

                if (debutinsc === 'cancel') throw new Error(canceled)
                debutinsc = debutinsc.replace(/le|à|a|h|:| +|\//ig, ' ').trim().split(' ')
                datedebutinsc.setFullYear(mtn.getFullYear());
                datedebutinsc.setMonth(+debutinsc[1]);
                datedebutinsc.setDate(+debutinsc[0]);
                coll.first().delete()
            })
        await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Date validée !', description: 'Quelle sera l\'heure du début des inscriptions ?\n__Format :__ `Heures:Minutes`\n__Exemples :__ `A 09h08` ou `à 01 01`'}]})
        await message.channel.awaitMessages(filterDate, {max: 1, idle: 30000, errors: 'time'})
            .then(async coll => {
                let debutinsc = await coll.first().content.toLowerCase()

                if (debutinsc === 'cancel') throw new Error(canceled)
                debutinsc = debutinsc.replace(/le|à|a|h|:| +|\//ig, ' ').trim().split(' ')
                datedebutinsc.setMinutes(+debutinsc[1]);
                datedebutinsc.setHours(+debutinsc[0]);
                datedebutinsc.setSeconds(0)
                coll.first().delete()
            })
        await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Date des inscriptions validée !', description: `Les inscriptions commenceront le ${datedebutinsc.toLocaleTimeString('fr-FR', options)}`, fields: [{name: next, value: 'Combien de temps avant le début du tournoi les inscriptions s\'arrêteront-elles ?\n__Format :__ `nb[j/h/m]`\n__Exemples :__ `1h` ou `37 minutes` ou `90min`'}]}]})
        await message.channel.awaitMessages(filterMsg, {max: 1, idle: 30000, errors: 'time'})
            .then(coll => {
                if (coll.first().content.toLowerCase() === 'cancel') throw new Error(canceled)
                fin = +ms(coll.first().content)
                coll.first().delete()
            })
        await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', footer: {text: 'Vous avez 2 minutes pour répondre à cette question'}, title: 'Date de fin des inscriptions validée !', description: `Les inscriptions finiront ${ms(fin, true)} avant le début du tournoi.`, fields: [{name: next, value: "Quel sera le déroulement du tournoi ? (maps, matches, etc)"}]}]})
        await message.channel.awaitMessages(filterMsg, {max: 1, idle: 120000, errors: 'time'})
            .then(coll => {
                if (coll.first().content.toLowerCase() === 'cancel') throw new Error(canceled)
                deroulement = coll.first().content
                coll.first().delete()
            })
        await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Déroulement du tournoi validé !', description: `Voici le déroulement du tournoi :\n:speech_balloon: ${deroulement}`, fields: [{name: next, value: "Combien d'équipes pourront au maximum s'enregistrer ? (Donner un nombre entre 2 et 60)"}]}]})
        await message.channel.awaitMessages(filterNumber2a60, {max: 1, idle: 30000, errors: 'time'})
            .then(async coll => {
                if (coll.first().content.toLowerCase() === 'cancel') throw new Error(canceled)
                nbteam = await +coll.first().content
                coll.first().delete()
            })
        await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Nombre maximal d\'équipes validé !', description: `Il y aura un maximum de ${nbteam} équipes dans ce tournoi.`, fields: [{name: next, value: `Combien d'équipes s'affronteront dans un lobby ? (Donner un nombre entre 2 et ${nbteam})`}]}]})
        await message.channel.awaitMessages(filterNumber2a60, {max: 1, idle: 30000, errors: 'time'})
            .then(async coll => {
                room = await coll.first().content
                if (room.toLowerCase() === 'cancel') throw new Error(canceled)
                room = +room
                coll.first().delete()
            })
        if (room>2) {
            await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Nombre d\'équipes par lobby enregistré !', description: `${room} équipes s'affronteront dans chaque room`, fields: [{name: next, value: `Combien il y aura-t-il d'équipes gagnantes par lobby (finale exceptée) ? (Donner un nombre entre 1 et ${Math.min(10, room-1)})`}]}]})
            await message.channel.awaitMessages(filterNumber1a10, {max: 1, idle: 30000, errors: 'time'})
                .then(async coll => {
                    winners = await coll.first().content
                    if (winners.toLowerCase() === 'cancel') throw new Error(canceled)
                    winners = +winners
                    coll.first().delete()
                })
            await await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Nombre d\'équipes gagnantes par lobby enregistré !', description: `Il y aura ${winners} gagnants par lobby, finale exceptée.`, fields: [{name: next, value: 'Combien il y aura-t-il de personnes par équipes ? (Donner un nombre entre 1 et 30)'}]}]})
        } else {
            await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Nombre d\'équipes par lobby enregistré !', description: `${room} équipes s'affronteront dans chaque room (1 vainqueur par room)`, fields: [{name: next, value: 'Combien il y aura-t-il de personnes par équipes ? (Donner un nombre entre 1 et 30)'}]}]})
        }
        await message.channel.awaitMessages(filterNumber1a30, {max: 1, idle: 30000, errors: 'time'})
            .then(async coll => {
                compo = await coll.first().content
                if (compo.toLowerCase() === 'cancel') throw new Error(canceled)
                compo = +compo
                coll.first().delete()
            })
        let composition = `${compo} personnes par équipes.`

        if (compo > 1) {
            await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Composition des équipes validée !', description: `Il y aura ${compo} joueurs par équipe dans ce tournoi.`, fields: [{name: next, value: 'Le tournoi sera-t-il avec des équipes faites au hasard ?'}]}]})
            await msg.react('✅')
            await msg.react('❌')
            await msg.awaitReactions(filterReaction, {max: 1, idle: 30000, errors: 'time'})
                .then(async coll => {
                    const answer = await coll.first()._emoji.name

                    if (answer === '✅') random = true
                })
            await msg.reactions.removeAll()

            if (random) composition += `\n:warning: Équipes faites au hasard`
            await msg.edit({content: warning, embeds: [{color: 'DARK_GREEN', title: 'Composition des équipes validée !', description: `Il y aura ${composition}`, fields: [{name: next, value: 'Voulez-vous autoriser les équipes incomplètes ?'}]}]})
            await msg.react('✅')
            await msg.react('❌')
            await msg.awaitReactions(filterReaction, {max: 1, idle: 30000, errors: 'time'})
                .then(async coll => {
                    const answer = await coll.first()._emoji.name

                    if (answer === '✅') {
                        incomplets = true
                        complet = '\n:warning: Équipes incomplètes autorisées'
                    }
                })
            await msg.reactions.removeAll()
        }
        await msg.edit({content: warning, embeds: [{color: 'GREEN', title: '', description: `Voici un récapitulatif du tournoi :\n__**Nom :**__ ${nomdutournoi} ;\n\n__**Prix :**__ ${CP}\n\n__**Date :**__ Le ${date.toLocaleTimeString('fr-FR', options)}\n\n__**Durée :**__ ${ms(duration, true)}\n\n__**Déroulement :**__\n:speech_balloon: ${deroulement}\n\n__**Début des inscriptions :**__ Le ${datedebutinsc.toLocaleTimeString('fr-FR', options)}\n\n__**Fin des inscriptions :**__ ${ms(fin, true)} avant le début du tournoi.\n\n__**Nombre maximal d'équipes inscrites :**__ ${nbteam}\n\n__**Nombre de joueur(s) par équipe :**__ ${compo}\n${complet}\n\n__**Lobbys :**__ ${room} équipes par lobby\n\n__**Staff :**__ <@&${staffid}>`, footer: {text: 'Réagissez avec ✅ pour valider, avec ❌ pour annuler'}}]})
        await msg.react('✅')
        await msg.react('❌')
        await msg.awaitReactions(filterReaction, {max: 1, idle: 60000, errors: 'time'})
            .then(async coll => {
                const emoji = await coll.first()._emoji.name

                switch (emoji) {
                case '✅':
                    await message.channel.send({embeds: [{color: "GREEN", title: 'La commande a été validée !', description: "Création de la catégorie du Tournoi..."}]})
                        .then(mesg => validation = mesg)
                    positions = await message.guild.channels.cache.filter(chann => chann.type === 'category')

                    await message.guild.channels.create(`Tournoi du ${date.getDate()}/${date.getMonth()}`, {
                        permissionOverwrites: [
                            {
                                id: message.guild.roles.everyone,
                                allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                            }
                        ],
                        type: 'category',
                        position: positions.size
                    })
                        .then(channel => parentid = channel.id)
                    await validation.edit({embeds: [{color: 'GREEN', title: 'La commande a été validée !', description: 'Création du channel d\'informations...'}]})
                    await message.guild.channels.create('infos-tournoi', {
                        type: 'text',
                        parent: parentid,
                        permissionOverwrites: [
                            {
                                id: message.guild.roles.everyone,
                                allow: ['READ_MESSAGE_HISTORY', 'VIEW_CHANNEL'],
                                deny: ['ADD_REACTIONS', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
                                type: 'role',
                            }
                        ],
                        position: 1
                    })
                        .then(ch => InfosChannel = ch)
                    await validation.edit({embeds: [{color: 'GREEN', title: 'La commande a été validée !', description: 'Création du channel d\'inscriptions...'}]})
                    await message.guild.channels.create('inscriptions-tournoi', {
                        type: 'text',
                        parent: parentid,
                        permissionOverwrites: [
                            {
                                id: message.guild.roles.everyone,
                                allow: ['READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'VIEW_CHANNEL'],
                                deny: ['ADD_REACTIONS', 'MANAGE_MESSAGES'],
                                type: 'role'
                            }
                        ],
                        position: 2
                    })
                        .then(ch => InscriptionsChannel = ch)
                    await validation.edit({embeds: [{color: 'GREEN', title: 'La commande a été validée !', description: 'Création du channel du staff...'}]})
                    await message.guild.channels.create('staff-tournoi', {
                        type: 'text',
                        parent: parentid,
                        permissionOverwrites: [
                            {
                                id: staffid,
                                allow: ['READ_MESSAGE_HISTORY', 'SEND_MESSAGES', 'VIEW_CHANNEL', 'ADD_REACTIONS', 'MANAGE_MESSAGES'],
                                type: 'role'
                            },
                            {
                                id: message.guild.roles.everyone,
                                deny: ['VIEW_CHANNEL'],
                                type: 'role'
                            }
                        ],
                        position: 3
                    })
                        .then(ch => StaffChannel = ch)
                    await validation.edit({embeds: [{color: 'GREEN', title: 'La commande a été validée !', description: "- `forceunregister` : obliger un membre à quitter un tournoi,\n- `list` : obtenir la liste des inscrits,\n- `check` : vérification des résultats,\n- `bantournoi` : bannissement d'un membre aux tournois,\n- `unbantournoi` : révocation du bannissement d'un membre aux tournois,\n- `deletetournoi` : suppression du tournoi."}]})
                    await StaffChannel.send({embeds: [{color: "DARK_GREEN", title: 'Voici la liste des commandes à connaître :', description: "Création de la catégorie du Tournoi..."}]})
                        .then(mesg => mesg.pin())
                    await InfosChannel.send({content: `@everyone`, embeds: [{
                        title: `Tournoi "${nomdutournoi}"`,
                        color: 'AQUA',
                        timestamp: Date.now(),
                        fields: [
                            {
                                name: '__Prix :__',
                                value: `${CP}`
                            },
                            {
                                name: '__Date :__',
                                value: `Le ${date.toLocaleTimeString('fr-FR', options)}`
                            },
                            {
                                name: '__Durée :__',
                                value: ms(duration),
                                inline: true
                            },
                            {
                                name: '__Déroulement du tournoi :__',
                                value: deroulement
                            },
                            {
                                name: '__Début des inscriptions :__',
                                value: `Le ${datedebutinsc.toLocaleTimeString('fr-FR', options)}`
                            },
                            {
                                name: '__Fin :__',
                                value: `${ms(fin, true)} avant le début du tournoi`,
                                inline: true
                            },
                            {
                                name: '__Nombre maximal d\'équipes incrites :__',
                                value: `${nbteam} équipes (${room} équipes par lobby)`
                            },
                            {
                                name: '__Composition des équipes :__',
                                value: `${composition}${complet}`,
                                inline: true
                            }
                        ]
                    }]}).then(m => { m.pin().then(mm => { mm.channel.messages.cache.forEach(e => { if(e.system) e.delete() }) }) })
                    await InscriptionsChannel.send({embeds: [{color: "DARK_AQUA", title: `Voici le channel d'inscriptions du Tournoi ${nomdutournoi} !`, description: `Voir les infos : <#${InfosChannel.id}>\n\nFaites \`${settings.prefix}register\` pour vous inscrire.\n Faites \`${settings.prefix}unregister\` pour vous désinscrire.\nFaites \`${settings.prefix}timer\` pour connaître le temps restant avant le début du tournoi.\nFaites \`${settings.prefix}infos\` pour connaître les informations du tournoi en temps réel.`}]})
                        .then(mesg => mesg.pin())
                    await InfosChannel.setTopic(`Inscriptions ici : <#${InscriptionsChannel.id}>\n Commande : 📥 ***${settings.prefix}register***`)
                    await InscriptionsChannel.setTopic(`Informations disponibles ici : <#${InfosChannel.id}>`)
                    await StaffChannel.setTopic(`Salon d'informations : <#${InfosChannel.id}>\nSalon d'inscriptions : <#${InscriptionsChannel.id}>\n\n__Liste des commandes à connaître :__\n\n📤 *${settings.prefix}forceunregister* : obliger un membre à quitter un tournoi,\n📜 *${settings.prefix}list* : obtenir la liste des inscrits,\n📯 *${settings.prefix}check* : vérification des résultats,\n🔒 *${settings.prefix}bantournoi* : bannissement d'un membre aux tournois,\n🔓 *${settings.prefix}unbantournoi* : révocation du bannissement,\n🗑️ *${settings.prefix}deletetournoi* : suppression du tournoi.`)
                    await validation.edit({embeds: [{color: 'GREEN', title: 'La commande a été validée !', description: 'Création du tournoi...'}]})
                    await message.guild.roles.create({data: {
                        name: `Tournoi ${nomdutournoi}`,
                        color: 'DARK_AQUA',
                        mentionnable: false
                    }})
                        .then(role => roleTournoi = role.id)
                    const tournoi = {
                        guildID: message.guild.id,
                        InscriptionsChannelID: InscriptionsChannel.id,
                        StaffChannelID: StaffChannel.id,
                        NomduTournoi: nomdutournoi,
                        Date: date,
                        Duree: duration,
                        InscriptionsDate: datedebutinsc,
                        InscriptionsFin: fin,
                        NbdeTeams: nbteam,
                        Lobbys: room,
                        Gagnants: winners,
                        Compo: compo,
                        Random: random,
                        Incomplets: incomplets,
                        RoleTournoi: roleTournoi,
                        Inscrits: []
                    }

                    const inscriptionstime = tournoi.InscriptionsDate.valueOf()-Date.now()

                    await validation.edit({embeds: [{color: 'GREEN', title: "Tournoi créé avec succès !"}]})
                    await client.createTournoi(tournoi)
                        .then(tn => client.clock((tnid, setings) => {
                            client.emit('begintournoi', tnid, setings)
                        }, inscriptionstime, tn._id, settings))
                    break
                default:
                    return msg.edit(`<@${message.author.id}>, la commande a été annulée avec succès.`)
                }
            })
    } catch (e) {
        return message.reply(canceled)
    }
}
module.exports.help = MESSAGES.Commandes.Tournaments.TOURNOI;
