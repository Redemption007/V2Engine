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

    client.reTry = f => f().catch(() => setTimeout(() => client.reTry(f), 3000))         //Pour régler la ParallelSave Error de MongoDB. En espérant que ça marche !

    client.clock = (f, Time, _1, _2, _3, _4) => {
        if (isNaN(Time)) return
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
        case 'moderation':
        case 'modération':
            return "Cette catégorie est réservée aux modérateurs & administrateurs du serveur. Elle regroupe toute les commandes nécessaires pour modérer un serveur."
        case 'admin':
            return "Cette catégorie est réservée aux administrateurs du serveur. Elle regroupe toutes les commandes pour paramétrer le bot sur le serveur."
        case 'tournoi':
            return "Cette catégorie n'est active que si des tournois sont en cours sur le serveur. Elle regroupe toutes les commandes concernant de près ou de loin les tournois, même celles de modération de tournois."
        case 'owner':
            return "Cette catégorie, invisible, n'est accessible que par l'owner du bot. Elle regroupe toutes les commandes de test, en développement ou sensibles."
        default:
            "Cette catégorie regroupe les commandes servant à améliorer la vie du serveur. Jeux, informations utiles, raccourcis, vous y trouverez de tout !"
        }
    }
}
