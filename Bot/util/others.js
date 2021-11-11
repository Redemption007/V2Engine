/* eslint-disable no-multi-spaces */
module.exports = client => {

    client.getObjectOf = async (arg, target, guild) => {
        const id = arg.replace(/<|!|&|#|>/g, )
        switch (target) {
        case 'user':
            // eslint-disable-next-line no-case-declarations
            const member1 = await guild.members.fetch(id)
            return member1.user
        case 'member':
            // eslint-disable-next-line no-case-declarations
            const member2 = await guild.members.fetch(id)
            return member2
        case 'channel':
            // eslint-disable-next-line no-case-declarations
            const channel = await guild.channels.cache.get(id)
            return channel
        case 'guild':
            // eslint-disable-next-line no-case-declarations
            const server = await client.guilds.fetch(id)
            return server
        case 'role':
        case 'rôle':
            // eslint-disable-next-line no-case-declarations
            const role = await guild.roles.fetch(id)
            return role
        }
    }

    client.typeOfChannel = channel => {
        switch (channel.type){
        case 'GUILD_TEXT':
            return 'Salon textuel'
        case 'DM':
            return 'DM'
        case 'GUILD_VOICE':
            return 'Salon Vocal'
        case 'GROUP_DM':
            return 'DM de groupe'
        case 'GUILD_CATEGORY':
            return 'Catégorie'
        case 'GUILD_NEWS':
            return 'Salons de nouveautés'
        case 'GUILD_STORE':
            return 'Salon Commercial'
        case 'GUILD_NEWS_THREAD':
            return 'Thread de nouveautés'
        case 'GUILD_PUBLIC_THREAD':
            return 'Thread public'
        case 'GUILD_PRIVATE_THREAD':
            return 'Thread privé'
        case 'GUILD_STAGE_VOICE':
            return 'Salon de stage'
        case 'UNKNOWN':
            return 'Inconnu'
        }
    }

    client.reTry = f => f().catch(() => setTimeout(() => client.reTry(f), 3000))         //Pour régler la ParallelSave Error de MongoDB. En espérant que ça marche !

    //Durée maximale : 1 an, 32 jours 7 heures, 55 minutes et 12 secondes
    client.clock = (f, Time, _1, _2, _3, _4) => {
        if (isNaN(Time)) throw new Error('ClockError: (at client.clock) Time is not a number: please enter an integer')
        setTimeout(() => {
            setTimeout(() => {
                setTimeout(() => {
                    setTimeout(() => {
                        setTimeout(() => {
                            setTimeout(() => {
                                setTimeout(() => {
                                    setTimeout(() => {
                                        setTimeout(() => {
                                            setTimeout(() => {
                                                setTimeout(() => {
                                                    setTimeout(() => {
                                                        setTimeout(() => {
                                                            setTimeout(() => {
                                                                setTimeout(() => {
                                                                    setTimeout(async () => {
                                                                        await f(_1, _2, _3, _4)
                                                                    }, Time/16)
                                                                }, Time/16)
                                                            }, Time/16)
                                                        }, Time/16)
                                                    }, Time/16)
                                                }, Time/16)
                                            }, Time/16)
                                        }, Time/16)
                                    }, Time/16)
                                }, Time/16)
                            }, Time/16)
                        }, Time/16)
                    }, Time/16)
                }, Time/16)
            }, Time/16)
        }, Time/16)
    }

    client.helpCategory = category => {
        switch (category) {
        case 'admin':
            return "Cette catégorie est réservée aux administrateurs du serveur. Elle regroupe toutes les commandes pour paramétrer le bot sur le serveur."
        case 'animation':
        case 'animations':
            return "Cette catégorie est réservée aux animateurs. Elle regroupe toutes les commandes exécutables par ceux-ci et tous les outils nécessaires pour accompagner les animations correctement. Enjoy !"
        case 'helper':
            return "Cette catégorie sert à vous aider et à vous orienter parmi les commandes du bot. Faites :\n- `help` pour obtenir la liste de toutes les catégories.\n- `help <categorie>` pour obtenir la liste des commandes pour une catégorie donnée.\n- `help <commande>` pour obtenir des informations sur une commande donnée."
        case 'moderation':
        case 'modération':
            return "Cette catégorie est réservée aux modérateurs & administrateurs du serveur. Elle regroupe toute les commandes nécessaires pour modérer un serveur."
        case 'owner':
            return "Cette catégorie, invisible, n'est accessible que par l'owner du bot. Elle regroupe toutes les commandes de test, en développement ou sensibles."
        case 'tournaments':
        case 'tournament':
        case 'tournois':
        case 'tournoi':
            return "Cette catégorie n'est active que si des tournois sont en cours sur le serveur. Elle regroupe toutes les commandes concernant de près ou de loin les tournois, même celles de modération de tournois."
        case 'utilitaire':
        case 'utilitaires':
            return "Cette catégorie regroupe les commandes servant à améliorer la vie du serveur. Jeux, informations utiles, raccourcis, vous y trouverez de tout !"
        default:
            "Cette catégorie regroupe les commandes servant à améliorer la vie du serveur. Jeux, informations utiles, raccourcis, vous y trouverez de tout !"
        }
    }

    client.arrondir = nombre => {
        let tronque
        if ((''+nombre).length>9) {
            tronque = Math.trunc(nombre*0.000001)
            return tronque*0.001+'G'
        }
        if ((''+nombre).length>6) {
            tronque = Math.trunc(nombre*0.0001)
            return tronque*0.01+'M'
        }
        if ((''+nombre).length>4) {
            tronque = Math.trunc(nombre*0.01)
            return tronque*0.1+'K'
        }
        return nombre
    }

    client.replaced = async (message, string) => {
        const guild = await client.getGuild(message.guild)
        const dbUser = await client.getUser(message.member)
        const index = await dbUser.guildIDs.indexOf(message.guild.id)
        const level = Math.floor(0.63*Math.log(dbUser.xp[index]))
        const rang = guild.leaderboard.findIndex(rang => rang[0]===message.member.id)
        const xp_restante = Math.floor(dbUser.xp[index] - Math.exp(level/0.63))
        const pallier = Math.floor(Math.exp((level+1)/0.63))-Math.floor(Math.exp(level/0.63))

        const final_string = string.replace(/{{userlevel}}/gi, level).replace(/{{rang}}/gi, rang).replace(/{{xp_restante}}/gi, client.arrondir(xp_restante)).replace(/{{pallier}}/gi, client.arrondir(pallier)).replace(/{{user}}/gi, message.author).replace(/{{usertag}}/gi, message.author.tag).replace(/{{nickname}}/gi, message.member.nickname?message.member.nickname:message.author.username).replace(/{{servername}}/gi, message.guild.name)
        return final_string
    }
}
