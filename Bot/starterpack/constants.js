const MESSAGES = {
    Commandes: {
        Admin: {
            CONFIG: {
                name: "config",
                category: 'Admin',
                aliases: ['config'],
                description: "Modifie la base de données. Valeurs possibles :\n- `logchannel` Définit le channel de log (#channel).\n- `prefix` Définit le préfixe du bot sur le serveur.\n- `welcomeMessage` Définit le message de bienvenue.",
                cooldown: 10,
                arg: true,
                usage: "config <paramètre> <valeur>",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            EVAL: {
                name: "eval",
                category: 'Owner',
                aliases: ['eval'],
                description: "Bot Owner seulement",
                cooldown: 10,
                arg: true,
                usage: "eval <code à tester>",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            LOGERROR: {
                name: "logerror",
                category: 'Owner',
                aliases: ['logerror', 'log', 'logs'],
                description: "Bot Owner seulement",
                cooldown: 1,
                arg: true,
                usage: "logerror <ID_error>",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            RESTART: {
                name: "restart",
                category: 'Owner',
                aliases: ['restart', 'reload'],
                description: "Pour relancer le bot. Bot Owner seulement",
                cooldown: 10,
                arg: false,
                usage: "reload",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            SETUP: {
                name: "setup",
                category: 'Admin',
                aliases: ['setup', 'set-up'],
                description: "Configure le bot à son arrivée sur le serveur.",
                cooldown: 30,
                arg: false,
                usage: "setup",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            }
        },
        Animation: {
            ADDROLE: {
                name: "addrole",
                category: 'Animation',
                aliases: ["addrole", "ar"],
                description: "Pour les animations. Ajoute un rôle déterminé que peuvent ajouter les animateurs en faisant `giverole <@user> <ID>`",
                cooldown: 5,
                arg: true,
                usage: "addrole <@role ou ID_role>",
                isUserModo: false,
                Admin: true,
                Modo: false,
                Animation: false
            },
            DELETEROLE: {
                name: "deleterole",
                category: 'Animation',
                aliases: ["deleterole", "dr"],
                description: "Pour les animations. Supprime un rôle déterminé que peuvent ajouter les animateurs.",
                cooldown: 5,
                arg: true,
                usage: "deleterole <@role ou ID_role>",
                isUserModo: false,
                Admin: true,
                Modo: false,
                Animation: false
            },
            GIVEROLE: {
                name: "giverole",
                category: 'Animation',
                aliases: ["giverole", "gr"],
                description: "Pour les animateurs. Donne le rôle déterminé. Pour ajouter un rôle déterminé à ajouter, faites `addrole`",
                cooldown: 5,
                arg: true,
                usage: "giverole <@user ou user_ID> <numéro>",
                isUserModo: false,
                Admin: false,
                Modo: false,
                Animation: true
            },
            REMOVEROLE: {
                name: "removerole",
                category: 'Animation',
                aliases: ["removerole", "remr"],
                description: "Pour les animations. Supprime au membre le rôle déterminé",
                cooldown: 5,
                arg: true,
                usage: "remove <@user ou user_ID> <numéro>",
                isUserModo: false,
                Admin: false,
                Modo: false,
                Animation: true
            },
            ROLELIST: {
                name: "rolelist",
                category: 'Animation',
                aliases: ["rolelist", "rl", "roleliste", "rôlelist", "rôleliste"],
                description: "Affiche la liste des rôles pouvant être ajoutés par un animateur.",
                cooldown: 5,
                arg: false,
                usage: "rolelist",
                isUserModo: false,
                Admin: false,
                Modo: false,
                Animation: true
            }/*,
            ADDTIMER: {},
            DELETETIMER: {}*/
        },
        BrawlStars: {
            ADDSERVERCLUB: {
                name: "addserverclub",
                category: 'BrawlStars',
                aliases: ['addserverclub', 'asclub'],
                description: "Ajoute un club dédié au serveur. Cette commande créera un rôle dédié à ce club, qui sera ajouté automatiquement aux joueurs connectant leur profil sur le serveur et appartenant au club.",
                cooldown: 5,
                arg: false,
                usage: "addserverclub <#tagBS>",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            BSSTATS: {
                name: "bsstats",
                category: 'BrawlStars',
                aliases: ['bsstats'],
                description: "Donne les stats du joueur.",
                cooldown: 5,
                arg: false,
                usage: "bsstats [@user]",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            CLUB: {
                name: "club",
                category: 'BrawlStars',
                aliases: ['club'],
                description: "Donne les spécificités du club auquel le tag correspond, ou bien le club de l'utilisateur concerné (votre club si pas d'arguments).",
                cooldown: 5,
                arg: false,
                usage: "club [#tagBS/@user/user_ID]",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            CLUBS: {
                name: "clubs",
                category: 'BrawlStars',
                aliases: ['clubs'],
                description: "Donne la liste des clubs reliés au serveur.",
                cooldown: 5,
                arg: false,
                usage: "clubs",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            COMPTES: {
                name: "comptes",
                category: 'BrawlStars',
                aliases: ['comptes'],
                description: "Donne la liste des comptes reliés à l'utilisateur.",
                cooldown: 5,
                arg: false,
                usage: "comptes [@user]",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            CONNECT: {
                name: "connect",
                category: 'BrawlStars',
                aliases: ['connect', 'addcompte'],
                description: "Ajoute un compte à l'utilisateur.",
                cooldown: 5,
                arg: true,
                usage: "connect <#tagBS>",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            DECONNECT: {
                name: "deconnect",
                category: 'BrawlStars',
                aliases: ['deconnect', 'deletecompte', 'delcompte', 'déconnecte', 'deco', 'déco'],
                description: "Supprime un (ou tous les) compte(s) lié(s) à l'utilisateur.",
                cooldown: 5,
                arg: true,
                usage: "deconnect [#tagBS]",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            DELETESERVERCLUB: {
                name: "deleteserverclub",
                category: 'BrawlStars',
                aliases: ['deleteserverclub', 'dsclub'],
                description: "Supprime un des club dédié au serveur. Cette commande supprimera le rôle dédié à ce club définitivement.",
                cooldown: 5,
                arg: false,
                usage: "deleteserverclub <#tagBS>",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            FORCECONNECT: {
                name: "forceconnect",
                category: 'BrawlStars',
                aliases: ['forceconnect', 'forceaddcompte', 'fco'],
                description: "Ajoute un compte BS lié à un utilisateur.",
                cooldown: 5,
                arg: true,
                usage: "forceconnect <@user ou user_ID> <#tagBS>",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            FORCEDECONNECT: {
                name: "forcedeconnect",
                category: 'BrawlStars',
                aliases: ['forcedeconnect', 'forcedeletecompte', 'forcedelcompte', 'forcedéconnecte', 'fdeco', 'fdéco'],
                description: "Supprime un compte lié à l'utilisateur.",
                cooldown: 5,
                arg: true,
                usage: "forcedeconnect <@user ou user_ID> <#tagBS>",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            TAG: {
                name: "tag",
                category: 'BrawlStars',
                aliases: ['tag'],
                description: "Envoie le message explicatif pour trouver son tag Brawl Stars.",
                cooldown: 15,
                arg: false,
                usage: "tag",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            }
        },
        Helper: {
            HELP: {
                name: "help",
                category: 'Helper',
                aliases: ['help', 'h'],
                description: "Donne la liste de toute les commandes, ou la description d'une seule.",
                cooldown: 5,
                arg: false,
                usage: "help [commande]",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            }
        },
        Moderation: {
            ADDXP: {
                name: "addxp",
                category: 'Moderation',
                aliases: ["addxp", "axp"],
                description: "Ajoute de l'expérience à un membre.",
                cooldown: 5,
                arg: true,
                usage: "addxp [@user] <amount>",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            BAN: {
                name: "ban",
                category: 'Moderation',
                aliases: ["ban"],
                description: "Bannit un utilisateur.",
                cooldown: 5,
                arg: true,
                usage: "ban <@user> <raison>",
                isUserModo: true,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            BANN: {
                name: "bann",
                category: 'Moderation',
                aliases: ["bann", "banne", "baan", "bn", "ciao"],
                description: "Trolle un utilisateur en l'annonçant banni.",
                cooldown: 5,
                arg: true,
                usage: "bann <@user> <raison>",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            DELETEXP: {
                name: "deletexp",
                category: 'Moderation',
                aliases: ["deletexp", "dxp"],
                description: "Supprime de l'expérience à un membre.",
                cooldown: 5,
                arg: true,
                usage: "deletexp [@user] <amount>",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            KICK: {
                name: 'kick',
                category: 'Moderation',
                aliases: ['kick'],
                description: 'Kick un utilisateur.',
                cooldown: 5,
                arg: true,
                usage: 'kick <@user> <raison>',
                isUserModo: true,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            MUTE: {
                name: 'mute',
                category: 'Moderation',
                aliases: ['mute', 'chut'],
                description: 'Mute un utilisateur. Le temps doit être donné en a(années), w(semaines), j (jours), h (heures), m (minutes) ou s (secondes).',
                cooldown: 10,
                arg: true,
                usage: 'mute <@user> [durée] [raison]',
                isUserModo: true,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            PRUNE: {
                name: "prune",
                category: "Moderation",
                aliases: ["prune", "filtre"],
                description: "Purge un salon d'un certain nombre de messages pour un user donné.",
                cooldown: 10,
                arg: true,
                usage: `prune <@user> <nombre_de_messages>\`\navec le nombre compris entre 1 et 100.\``,
                isUserModo: true,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            PURGE: {
                name: "purge",
                category: "Moderation",
                aliases: ["purge", 'clear', 'clean'],
                description: "Purge un salon d'un certain nombre de messages.",
                cooldown: 10,
                arg: true,
                usage: `purge <nb_de_msgs>\` avec le nb compris entre 1 et 100.\``,
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            RESETXP: {
                name: "resetxp",
                category: 'Moderation',
                aliases: ["resetxp", "rxp"],
                description: "Remet à zéro l'expérience d'un membre.",
                cooldown: 5,
                arg: true,
                usage: "resetxp <@user ou ID>",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            UNBAN: {
                name: "unban",
                category: "Moderation",
                aliases: ["unban"],
                description: "Débannit un utilisateur.",
                cooldown: 10,
                arg: true,
                usage: "unban <user_id> [raison]",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            UNMUTE: {
                name: 'unmute',
                category: 'Moderation',
                aliases: ['unmute', 'parle'],
                description: 'Démute un utilisateur.',
                cooldown: 10,
                arg: true,
                usage: 'unmute <@user> [raison]',
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: true,
            }
        },
        Tournaments: {
            BANNED: {
                name: "banned",
                category: 'Tournaments',
                aliases: ["banned"],
                description: "Affiche la liste des utilisateurs bannis des tournois.",
                cooldown: 10,
                arg: false,
                usage: "banned",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            BANTOURNOI: {
                name: "bantournoi",
                category: 'Tournaments',
                aliases: ["bantournoi"],
                description: "Enlève la possibilité à un utilisateur de participer à tournoi.",
                cooldown: 5,
                arg: true,
                usage: "bantournoi <@user> <raison>",
                isUserModo: true,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            CHANGEWINNERS: {
                name: "changewinners",
                category: 'Tournaments',
                aliases: ["changewinners", "cw"],
                description: "Change immédiatement le nombre de gagnants par lobby lors d'un tournoi",
                cooldown: 20,
                arg: true,
                usage: "changewinners <number>",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            CHECK: {
                name: "check",
                category: 'Tournaments',
                aliases: ["check"],
                description: "Désigne le vainqueur du lobby. (Possibilité de désigner plusieurs équipes en même temps)\nDans le cadre d'un tournoi solo, ce sont les ID Discord des joueurs qui sont demandés.",
                cooldown: 5,
                arg: false,
                usage: "check",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            DELETETOURNOI: {
                name: "deletetournoi",
                category: 'Tournaments',
                aliases: ["deletetournoi", "dtournoi"],
                description: "Supprime le tournoi correspondant.",
                cooldown: 30,
                arg: false,
                usage: "deletetournoi",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            FORCEUNREGISTER: {
                name: "forceunregister",
                category: 'Tournaments',
                aliases: ["forceunregister", "funre"],
                description: "Désinscrit un utilisateur du tournoi concerné par le salon dans lequel la commande est tapée.",
                cooldown: 10,
                arg: true,
                usage: "forceunregister @user",
                isUserModo: true,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            INFOS: {
                name: "infos",
                category: 'Tournaments',
                aliases: ['infos'],
                description: "Renvoie les informations d'un tournoi en temps réel.",
                cooldown: 30,
                arg: false,
                usage: "infos",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            LIST: {
                name: 'list',
                category: 'Tournaments',
                aliases: ['list', 'liste'],
                description: 'Affiche la liste des membres inscrits au tournoi en temps réel.',
                cooldown: 10,
                arg: false,
                usage: 'list',
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            REGISTER: {
                name: "register",
                category: "Tournaments",
                aliases: ['register', 'inscription'],
                description: 'Permet de s\' inscrire à un tournoi en cours. Fonctionnel uniquement dans le salon d\'inscriptions du tournoi concerné.',
                cooldown: 60,
                arg: false,
                usage: 'register',
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false
            },
            SUBMIT: {
                name: "submit",
                category: "Tournaments",
                aliases: ['submit'],
                description: 'Envoie les résultats d\'un lobby. Fonctionnel uniquement dans un lobby.',
                cooldown: 30,
                arg: false,
                usage: 'submit',
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false
            },
            TIMER: {
                name: "timer",
                category: 'Tournaments',
                aliases: ['timer'],
                description: "Affiche le temps restant avant le tournoi.",
                cooldown: 30,
                arg: false,
                usage: "timer",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            TOURNOI: {
                name: "tournoi",
                category: 'Tournaments',
                aliases: ['tournoi'],
                description: "Démarre un tournoi.",
                cooldown: 10,
                arg: false,
                usage: "tournoi",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            UNBANTOURNOI: {
                name: "unbantournoi",
                category: 'Tournaments',
                aliases: ["unbantournoi"],
                description: "Rend la possibilité à un utilisateur de participer à tournoi.",
                cooldown: 10,
                arg: true,
                usage: "unbantournoi <@user> [raison]",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            UNREGISTER: {
                name: "unregister",
                category: 'Tournaments',
                aliases: ['unregister', 'désinscription'],
                description: "Désinscrit l'utilisateur du tournoi correspondant au salon d'inscription dans lequel la commande a été faite.",
                cooldown: 120,
                arg: false,
                usage: "unregister",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
        },
        Utilitaires: {
            ABSENCES: {
                name: "absences",
                category: 'Utilitaires',
                aliases: ['absences'],
                description: "Affiche les absences d'un groupoe ou d'un utilisateur.",
                cooldown: 2,
                arg: false,
                usage: "absences [groupe]",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            ABSENT: {
                name: "absent",
                category: 'Utilitaires',
                aliases: ['absent', 'abs'],
                description: "Indique une absence prochaine d'un membre d'un groupe donné",
                cooldown: 2,
                arg: true,
                usage: "absent <groupe> <durée>",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            ADDGROUP: {
                name: "addgroup",
                category: 'Utilitaires',
                aliases: ['addgroup', 'addgroups'],
                description: "Ajoute un groupe sur le serveur",
                cooldown: 2,
                arg: false,
                usage: "addgroup",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            DM: {
                name: "dm",
                category: 'Utilitaires',
                aliases: ['dm'],
                description: "Indique si le bot va envoyer des DM à l'utilisateur pour certaines commandes (hors DM Reaction)",
                cooldown: 2,
                arg: false,
                usage: "dm [accept/denie]",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            DELETEGROUP: {
                name: "deletegroup",
                category: 'Utilitaires',
                aliases: ['deletegroup', 'deletegroups'],
                description: "Supprime un groupe sur le serveur",
                cooldown: 2,
                arg: true,
                usage: "deletegroup <Nom>",
                isUserModo: false,
                Animation: false,
                Admin: true,
                Modo: false,
            },
            DMREACTION: {
                name: "dmreaction",
                category: 'Utilitaires',
                aliases: ['dmreaction', 'dmr'],
                description: "DM celui qui réagit au message sur lequel cette commande est utilisée.",
                cooldown: 10,
                arg: false,
                usage: "dmreaction",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            EMBED: {
                name: "embed",
                category: 'Utilitaires',
                aliases: ['embed', 'e'],
                description: "Crée une intégration selon les critères voulus.",
                cooldown: 10,
                arg: true,
                usage: "embed COULEUR, Titre, Description",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            GROUPS: {
                name: "groups",
                category: 'Utilitaires',
                aliases: ['groups'],
                description: "Affiche, s'il y en a, les groupes enregistrés du serveur.",
                cooldown: 2,
                arg: false,
                usage: "groups",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            ID: {
                name: "id",
                category: 'Utilitaires',
                aliases: ['id'],
                description: "Renvoie l'id d'un emoji (ou sa version unicode), d'un utilisateur, d'un salon ou d'un rôle.",
                cooldown: 5,
                arg: true,
                usage: "id <emoji/@user/#salon/@rôle>",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            LEADERBOARD: {
                name: "leaderboard",
                category: 'Utilitaires',
                aliases: ['leaderboard', 'lb', 'classement'],
                description: "Renvoie le classement du serveur par points d'expériences et par niveau.",
                cooldown: 5,
                arg: false,
                usage: "leaderboard",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            NUKE: {
                name: "nuke",
                category: 'Utilitaires',
                aliases: ['nuke'],
                description: "Supprime le channel et en recrée un à l'identique.",
                cooldown: 10,
                arg: false,
                usage: "nuke",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            PING: {
                name: "ping",
                category: 'Utilitaires',
                aliases: ['ping', 'p', 'pong'],
                description: "Renvoie pong et donne la latence.",
                cooldown: 10,
                arg: false,
                usage: "ping",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            REVENU: {
                name: "revenu",
                category: 'Utilitaires',
                aliases: ['revenu', 'deretour'],
                description: "Indique le retour dans un groupe d'un membre plus tôt que prévu",
                cooldown: 2,
                arg: true,
                usage: "revenu <groupe>",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            ROLEREACTION: {
                name: "rolereaction",
                category: 'Utilitaires',
                aliases: ['rolereaction', 'rr'],
                description: "Ajoute un rôle à  celui qui réagit au message sur lequel cette commande est utilisée.",
                cooldown: 10,
                arg: false,
                usage: "rolereaction",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: true,
            },
            SAY: {
                name: "say",
                category: 'Utilitaires',
                aliases: ['say', 'repeat', 'rep', 'dis'],
                description: "Renvoie le message dicté par l'utilisateur.",
                cooldown: 10,
                arg: true,
                usage: "say <votre message>",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            STATS: {
                name: "stats",
                category: 'Utilitaires',
                aliases: ['stats'],
                description: "Envoie les statistiques du serveur.",
                cooldown: 5,
                arg: false,
                usage: "stats",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            },
            XP: {
                name: "xp",
                category: 'Utilitaires',
                aliases: ['xp', 'rang', 'rank'],
                description: "Renvoie l'expérience de l'utilisateur",
                cooldown: 10,
                arg: false,
                usage: "xp <@user>",
                isUserModo: false,
                Animation: false,
                Admin: false,
                Modo: false,
            }
        }
    }
}

exports.MESSAGES = MESSAGES;
