const {MESSAGES} = require('../../starterpack/constants')
const {createCanvas, loadImage} = require('canvas')
const {MessageAttachment} = require('discord.js')

module.exports.run = async (client, message, args, settings) => {
    //Couleurs
    const gris = "#797979"
    const gris_clair = '#767E8D'
    const gris_discord = '#2F3136'
    const orange = '#F2AA26'
    const rouge = '#dc143c'
    const rouge_dnd = '#E4324B'
    const vert = '#45AB5B'
    //Positions
    const x_tot = 600
    const y_tot = 180
    const x_espace = 30
    const y_espace = 20
    const x_arc = 100
    const y_arc = 90
    const rayon = 56
    const x_presence = x_arc+rayon/Math.sqrt(2)
    const y_presence = y_arc+rayon/Math.sqrt(2)
    //Canvas et contexte
    const canvas = createCanvas(x_tot, y_tot)
    const ctx = canvas.getContext('2d')
    const background = await loadImage('https://cdn.discordapp.com/attachments/906726350323335189/906726565566627900/screen_mc.png')
    const font_size = 30

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
    const drawPresence = presence => {
        if (!presence || presence.status === 'offline') {
            ctx.beginPath();
            ctx.fillStyle = gris_clair
            ctx.lineWidth = 10
            ctx.strokeStyle = '#000'
            ctx.arc(x_presence, y_presence, rayon/5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fill()
            ctx.closePath();
            //Rond noir :
            ctx.beginPath();
            ctx.fillStyle = '#000'
            ctx.arc(x_presence, y_presence, rayon/10, 0, Math.PI * 2);
            ctx.fill()
            ctx.closePath();
            return
        }
        switch (presence.status) {
        case 'dnd':
            ctx.beginPath();
            ctx.fillStyle = rouge_dnd
            ctx.lineWidth = 10
            ctx.strokeStyle = '#000'
            ctx.arc(x_presence, y_presence, rayon/5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fill()
            //Rectangle noir :
            ctx.fillStyle = gris_discord
            ctx.fillRect(x_presence-rayon/7, y_presence-2.5, 2*rayon/7, 5)
            ctx.closePath();
            return
        case 'idle':
            ctx.beginPath();
            ctx.lineWidth = 10
            ctx.strokeStyle = '#000'
            ctx.arc(x_presence, y_presence, rayon/5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = orange
            ctx.fill();
            ctx.closePath();
            //Croissant orange :
            ctx.beginPath();
            ctx.arc(x_presence-rayon/12, y_presence-rayon/16, rayon/6, 0, Math.PI * 2);
            ctx.fillStyle = '#000'
            ctx.fill();            
            ctx.closePath();
            return
        case 'online':
        default:
            ctx.beginPath();
            ctx.lineWidth = 10
            ctx.strokeStyle = '#000'
            ctx.arc(x_presence, y_presence, rayon/5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = vert
            ctx.fill();
            ctx.closePath();
        }
    }

    //Rectangle sombre sur l'image :
    ctx.beginPath();
    ctx.lineWidth = 2
    ctx.fillStyle = '#000'
    ctx.globalAlpha = 0.6
    ctx.fillRect(x_espace, y_espace, x_tot-2*x_espace, y_tot-2*y_espace)

    let dbUser
    let member

    if (message.mentions.members.first()) {
        member = message.mentions.members.first();
        dbUser = await client.getUser(member)
        if (!dbUser) return message.reply(message.mentions.members.first()+' n\'a encore jamais parlé ! Invite-le à parler en entamant une discussion ou un jeu avec lui :wink:')
    } else {
        if (args.length) {
            if (!isNaN(+args[0])) {
                member = await message.guild.members.fetch(args[0])
                dbUser = await client.getUser({id: args[0]})
                if (!dbUser) {
                    if (member) return message.reply(`L'utilisateur d'ID ${args[0]} n'a encore jamais parlé ! Invite-le à parler en entamant une discussion ou un jeu avec lui :wink:`)
                    return message.reply(`L'utilisateur d'ID ${args[0]} n'existe pas ! Vérifie l'identifiant que tu as écris.`)
                }
                if (dbUser && !member) message.reply('Cet utilisateur n\'est plus dans la guilde ! Il n\'évolue donc plus en expérience jusqu\'à son retour ! Pour le supprimer, il vous suffit de remettre son xp à 0 !')
            }
        } else {
            member = message.member;
            dbUser = await client.getUser(member)
            if (!dbUser) return message.reply('Tu n\'a encore jamais parlé ! Entamant une discussion ou un jeu avec d\'autres membres pour gagner de l\'xp :wink:')
        }
    }

    //Données Utilisateur
    const index = await dbUser.guildIDs.indexOf(message.guild.id)
    const tag = member.user.tag.split('#')
    let i=5
    if (tag[0].length>20) i = 15
    if (tag[0].length>=15 && tag[0].length<=20) i = 10
    if (tag[0].length<=10) i = 0
    const level = Math.floor(0.63*Math.log(dbUser.xp[index]))
    const rang = settings.leaderboard.findIndex(rang => rang[0]===member.id)+1
    const xp_restante = Math.floor(dbUser.xp[index] - Math.exp(level/0.63))
    const pallier = Math.floor(Math.exp((level+1)/0.63))-Math.floor(Math.exp(level/0.63))
    //Images
    let avatar
    try {
        avatar = await loadImage(member.displayAvatarURL({format: 'jpg'}))
    } catch {
        avatar = await loadImage(member.user.displayAvatarURL({format: 'jpg'}))
    }
    //Positions
    ctx.font = `${font_size}px sans`
    const y_discriminator = y_arc-rayon+40
    const x_discriminator = Math.min(x_arc+rayon+5+ctx.measureText(tag[0]).width, 375)

    //Barre de progression totale :
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.moveTo(180, 125);
    ctx.lineTo(530, 125);
    ctx.stroke();
    ctx.closePath();
    
    //Barre progressive
    ctx.beginPath();
    ctx.strokeStyle = rouge;
    ctx.globalAlpha = 0.8;
    ctx.moveTo(180, 125);
    ctx.lineWidth = 20;
    ctx.lineTo(180+350*xp_restante/pallier, 125);
    ctx.stroke();
    ctx.closePath();

    //  Texte :
    //xp :
    ctx.globalAlpha = 1
    ctx.textAlign = 'right'
    ctx.font = '20px Arial'
    const taille_pallier = ctx.measureText(`/${client.arrondir(pallier)} XP`).width
    ctx.fillStyle = gris
    ctx.fillText(`/${client.arrondir(pallier)} XP`, 530, y_arc+15)
    ctx.fillStyle = '#fff'
    ctx.font = '18px Arial'
    ctx.fillText(client.arrondir(xp_restante), 530-taille_pallier, y_arc+15)

    //Level :
    ctx.textAlign = "left"
    ctx.font = `${font_size}px sans`
    ctx.fillText(level, x_arc+rayon+100, y_arc+15)
    ctx.fillStyle = gris
    ctx.font = `${font_size-15}px sans`
    ctx.fillText('NIVEAU : ', x_arc+rayon+20, y_arc+15)

    //Tag :
    ctx.fillStyle = '#fff'
    ctx.font = `${font_size-i}px sans`
    ctx.textAlign = 'left'
    ctx.fillText(tag[0], x_arc+rayon+5, y_discriminator)
    ctx.font = `${font_size-12}px sans`
    ctx.fillStyle = gris
    ctx.fillText('#'+tag[1], x_discriminator, y_discriminator)

    //Rang :
    ctx.textAlign = 'right'
    ctx.fillStyle = '#fff'
    ctx.font = `${font_size+10}px sans`
    const x_rang = x_tot-x_espace-15-ctx.measureText(`#1`).width
    ctx.fillText(`#`+rang, x_tot-x_espace-15, y_discriminator)
    ctx.font = `${font_size-15}px sans`
    ctx.fillStyle = gris
    ctx.fillText('RANG : ', x_rang, y_discriminator)

    //Avatar :
    ctx.save()
    ctx.beginPath();
    ctx.lineWidth = 8
    ctx.strokeStyle = '#000'
    ctx.arc(x_arc, y_arc, rayon, 0, Math.PI * 2);
    ctx.stroke();
    ctx.clip();
    ctx.drawImage(avatar, x_arc-rayon, y_arc-rayon, 2*rayon, 2*rayon);
    ctx.closePath();
    ctx.restore();
    drawPresence(member.presence)

    const attachment = new MessageAttachment(canvas.toBuffer(), "rang.png")

    return message.channel.send({files: [attachment]})
}
module.exports.help = MESSAGES.Commandes.Utilitaires.XP;
