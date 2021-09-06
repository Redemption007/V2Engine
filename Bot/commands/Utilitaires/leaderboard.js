const {MessageEmbed} = require('discord.js')
const {MESSAGES} = require('../../starterpack/constants')


module.exports.run = async (client, message) => {
    let Page = 0
    let Utilisateurs = ''
    let Niveaux = ''
    let position = 1
    let allUsers;

    allUsers = await client.getUsers(message.guild)
        .then(async p => allUsers = await p.sort((a, b) => a.xp < b.xp ? 1 : -1))

    const Nbpages = Math.floor(allUsers.length / 10)+1
    const leaderboard = new MessageEmbed()
        .setTitle('Classement des utilisateurs du serveur')
        .setFooter(`Classement demandé par ${message.author.tag}. Page ${Page+1}/${Nbpages}`)
        .setColor('DARK_RED')

    await allUsers.splice(10*Page, 10*(Page+1)-1).forEach(e => {
        Utilisateurs += `${position}- <@${e.userID}> : ${e.xp} points d'xp\n\n`;
        Niveaux += `__Niveau :__ ${e.level}\n\n`;
        position += 1;
    })
    leaderboard.addField('Utilisateurs', Utilisateurs, true)
    leaderboard.addField('Niveaux', Niveaux, true)
    message.channel.send(leaderboard)
        .then(async lb => {
            const filter = reaction => !reaction.me && (reaction.emoji.name === '◀️'||reaction.emoji.name === '⏹️'||reaction.emoji.name === '▶️')
            const collector = await lb.createReactionCollector(filter, {idle: 30000})

            await lb.react('◀️')
            await lb.react('⏹️')
            await lb.react('▶️')
            collector.on('collect', async r => {
                switch (r.emoji.name) {
                case '◀️':
                    r.users.remove(r.users.cache.filter(usr => !usr.bot ).first().id)
                    Page === 0 ? Page = Nbpages-1 : Page -= 1;
                    position = 1+10*Page
                    Utilisateurs = ''
                    Niveaux = ''

                    allUsers = await client.getUsers(message.guild)
                        .then(async p => allUsers = await p.sort((a, b) => a.xp < b.xp ? 1 : -1))
                    await allUsers.splice(10*Page, 10*(Page+1)-1).forEach(e => {
                        Utilisateurs += `${position}- <@${e.userID}> : ${e.xp} points d'xp\n\n`;
                        Niveaux += `__Niveau :__ ${e.level}\n\n`;
                        position += 1;
                    })
                    break
                case '⏹️':
                    collector.emit('end', r)
                    break
                case '▶️':
                    r.users.remove(r.users.cache.filter(usr => !usr.bot ).first().id)
                    Page === Nbpages-1 ? Page = 0 : Page += 1;
                    position = 1+10*Page
                    Utilisateurs = ''
                    Niveaux = ''

                    allUsers = await client.getUsers(message.guild)
                        .then(async p => allUsers = await p.sort((a, b) => a.xp < b.xp ? 1 : -1))
                    await allUsers.splice(10*Page, 10*(Page+1)-1).forEach(e => {
                        Utilisateurs += `${position}- <@${e.userID}> : ${e.xp} points d'xp\n\n`;
                        Niveaux += `__Niveau :__ ${e.level}\n\n`;
                        position += 1;
                    })
                    break
                }
                await lb.edit({embed: {
                    color: 'DARK_RED',
                    title: 'Classement des utilisateurs du serveur',
                    fields: [
                        {name: 'Utilisateurs', value: Utilisateurs, inline: true},
                        {name: 'Niveaux', value: Niveaux, inline: true}
                    ],
                    footer: {text: `Classement demandé par ${message.author.tag}. Page ${Page+1}/${Nbpages}`}
                }})
            })
            collector.on('end', async r => {
                await r.message.reactions.removeAll()
                lb.edit({embed: {
                    color: 'RED',
                    description: "Merci d'utiliser une nouvelle fois la commande si vous voulez voir le classement.",
                    footer: {text: 'Eh oui ! Tout à une fin...'}
                }})
            });
        })

}
module.exports.help = MESSAGES.Commandes.Utilitaires.LEADERBOARD;
