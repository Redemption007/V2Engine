/* eslint-disable no-multi-spaces */
const {MESSAGES} = require('../../starterpack/constants')
const {createCanvas, loadImage, registerFont} = require('canvas')
const {MessageAttachment} = require('discord.js')

module.exports.run = async (client, message, args) => {
    //Couleurs
    const gris = "#797979"
    const gris_clair = '#767E8D'
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
    const guild = await client.getGuild(message.guild)
    const image = guild.rankImage
    const canvas = createCanvas(x_tot, y_tot)
    const ctx = canvas.getContext('2d')
    const background = await loadImage(image)
    const font_size = 30
    registerFont('microsoft-sans-serif.ttf', {family: 'Regular'})
    const font = 'Regular'

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
            ctx.fillStyle = '#000'
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
    let content = ''

    if (message.mentions.members.first()) {
        member = message.mentions.members.first();
        dbUser = await client.getUser(member)
        if (!dbUser) return message.reply(`${message.mentions.members.first()} n'a encore jamais parl?? ! Invite-le ?? parler en entamant une discussion ou un jeu avec lui :wink:`)
    } else {
        if (args.length) {                                                        //S'il y a des arguments autre qu'une mention :
            if (args[0].match(/[0-9]{18}/)) {                                     // Recherche par id
                member = await message.guild.members.fetch(args[0])
                dbUser = await client.getUser({id: args[0]})
                if (!dbUser) {
                    if (member) return message.reply(`L'utilisateur d'ID ${args[0]} (${member.nickname||member.user.tag}) n'a encore jamais parl?? ! Invite-le ?? parler en entamant une discussion ou un jeu avec lui :wink:`)
                    return message.reply(`L'utilisateur d'ID ${args[0]} n'existe pas ! V??rifie l'identifiant que tu as ??cris.`)
                }
                if (dbUser && !member) content += ':warning: Cet utilisateur n\'est plus dans la guilde ! Il n\'??volue donc plus en exp??rience jusqu\'?? son retour ! Pour le supprimer, il vous suffit de reset son xp ! :warning:'
            } else {
                if (args[0].startsWith('#')) {                                    // Recherche par rang
                    let rank = args[0].split('#').join('')
                    if (rank>guild.leaderboard.length) {
                        content +=`:warning: Le rang indiqu?? est trop grand ! Le dernier rang du classement est rang **#${guild.leaderboard.length}** et voici sa carte d'exp??rience :warning:`
                        rank = guild.leaderboard.length
                    }
                    const member_id = guild.leaderboard[rank-1][0]
                    dbUser = await client.getUser({id: member_id})
                    member = await message.guild.members.fetch(member_id)
                    if (dbUser && !member) {
                        member = {id: member_id, presence: {status: 'offline'}, user: {tag: dbUser.username}}
                        content += ':warning: Cet utilisateur n\'est plus dans la guilde ! Il n\'??volue donc plus en exp??rience jusqu\'?? son retour ! Pour le supprimer, il vous suffit de reset son xp ! :warning:'
                    }
                }
                return message.reply(`Il faut saisir un utilisateur ou un rang en argument ! Faire \`${guild.prefix}help xp\` pour de plus amples informations.`)
            }
        } else {                                                                   //S'il n'y a pas d'arguments :
            member = message.member;
            dbUser = await client.getUser(member)
            if (!dbUser) return message.reply('Tu n\'a encore jamais parl?? ! Entamant une discussion ou un jeu avec d\'autres membres pour gagner de l\'xp :wink:')
        }
    }

    //Donn??es Utilisateur
    const index = await dbUser.guildIDs.indexOf(message.guild.id)
    if (index === -1) return message.reply(`L'utilisateur ${member.user} n'a encore jamais parl?? ! Invite-le ?? parler en entamant une discussion ou un jeu avec lui :wink:`)
    let tag = member.user.tag.split('#')
    let i=5
    if (member.nickname) tag[0] = member.nickname
    if (tag[0].length<=10) i = 0
    if (tag[0].length>=15 && tag[0].length<=20) i = 10
    if (tag[0].length>20) i = 15
    if (tag[0].length>30) i = 17
    let level = 0
    while (+client.levels[level+1]<+dbUser.xp[index]) {
        level++
    }
    const rang = guild.leaderboard.findIndex(rang => rang[0]===member.id)+1
    const pallier = client.levels[level+1]-client.levels[level]
    const xp_restante = dbUser.xp[index]-client.levels[level]
    //Images
    let avatar
    try {                                                                                     //Avatar de membre
        avatar = await loadImage(member.displayAvatarURL({format: 'jpg'}))
    } catch {                                                                                 //Si pas d'avatar de membre
        try {                                                                                 //Avatar d'utilisateur
            avatar = await loadImage(member.user.displayAvatarURL({format: 'jpg'}))
        } catch {                                                                             //Avatar classique Discord
            avatar = await loadImage('https://cdn.discordapp.com/attachments/906726350323335189/906968817282973696/idle.png')
        }
    }
    //Positions
    ctx.font = `${font_size}px ${font}`
    const y_discriminator = y_arc-rayon+40
    const x_discriminator = Math.min(x_arc+rayon+5+ctx.measureText(tag[0]).width, 400)

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
    ctx.font = `${font_size}px ${font}`
    ctx.fillText(level, x_arc+rayon+100, y_arc+15)
    ctx.fillStyle = gris
    ctx.font = `${font_size-15}px ${font}`
    ctx.fillText('NIVEAU : ', x_arc+rayon+20, y_arc+15)

    //Tag :
    ctx.fillStyle = '#fff'
    ctx.font = `${font_size-i}px ${font}`
    ctx.textAlign = 'left'
    ctx.fillText(tag[0], x_arc+rayon+5, y_discriminator)
    ctx.font = `${font_size-12}px ${font}`
    ctx.fillStyle = gris
    ctx.fillText('#'+tag[1], x_discriminator, y_discriminator)

    //Rang :
    ctx.textAlign = 'right'
    ctx.fillStyle = '#fff'
    ctx.font = `${font_size+10}px ${font}`
    const x_rang = x_tot-x_espace-15-ctx.measureText(`#1`).width
    ctx.fillText(`#`+rang, x_tot-x_espace-15, y_discriminator)
    ctx.font = `${font_size-15}px ${font}`
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

    if (!content) content = null

    return message.channel.send({content: content, files: [attachment]})
}
module.exports.help = MESSAGES.Commandes.Utilitaires.XP;
