const {MessageEmbed} = require('discord.js')
const {MESSAGES} = require('../../starterpack/constants')


module.exports.run = async (client, message) => {
    const guild = await client.getGuild(message.guild)
    let Page = 0
    let position = 1
    let Utilisateurs
    let Niveaux
    const allUsers = guild.leaderboard
    const afficherPage = async (Page, position) => {
        Utilisateurs = ''
        Niveaux = ''
        await allUsers.splice(10*Page, 10*(Page+1)-1).forEach(e => {
            Utilisateurs += `${position}- <@${e[0]}> : ${client.arrondir(e[1])} points d'xp\n\n`;
            Niveaux += `__Niveau :__ ${Math.floor(0.63*Math.log(e[1]))}\n\n`;
            position += 1;
        })
    }

    const Nbpages = Math.floor(allUsers.length / 10)+1
    const leaderboard = new MessageEmbed()
        .setTitle('Classement des utilisateurs du serveur')
        .setFooter(`Classement demandé par ${message.author.tag}. Page ${Page+1}/${Nbpages}`)
        .setColor('DARK_RED')

    afficherPage(Page, position)
    leaderboard.addField('Utilisateurs', Utilisateurs, true)
    leaderboard.addField('Niveaux', Niveaux, true)
    message.channel.send({embeds: [leaderboard]})
        .then(async lb => {
            const filter = reaction => reaction.users.cache.size>1 && (reaction.emoji.name === '◀️'||reaction.emoji.name === '⏹️'||reaction.emoji.name === '▶️')
            const collector = await lb.createReactionCollector({filter: filter, idle: 30000})

            if (Nbpages>1) await lb.react('◀️')
            await lb.react('⏹️')
            if (Nbpages>1) await lb.react('▶️')
            collector.on('collect', async r => {
                switch (r.emoji.name) {
                case '◀️':
                    r.users.remove(r.users.cache.filter(usr => !usr.bot).first().id)
                    Page === 0 ? Page = Nbpages-1 : Page -= 1;
                    position = 1+10*Page
                    afficherPage(Page, position)
                    break
                case '⏹️':
                    collector.stop()
                    break
                case '▶️':
                    r.users.remove(r.users.cache.filter(usr => !usr.bot ).first().id)
                    Page === Nbpages-1 ? Page = 0 : Page += 1;
                    position = 1+10*Page
                    afficherPage(Page, position)
                    break
                }
                await lb.edit({embeds: [{
                    color: 'DARK_RED',
                    title: 'Classement des utilisateurs du serveur',
                    fields: [
                        {name: 'Utilisateurs', value: Utilisateurs, inline: true},
                        {name: 'Niveaux', value: Niveaux, inline: true}
                    ],
                    footer: {text: `Classement demandé par ${message.author.tag}. Page ${Page+1}/${Nbpages}`}
                }]})
            })
            collector.on('end', async () => {
                await lb.reactions.removeAll()
                lb.edit({embeds: [{
                    color: 'RED',
                    description: "Merci d'utiliser une nouvelle fois la commande si vous voulez voir le classement.",
                    footer: {text: 'Eh oui ! Tout à une fin...'}
                }]})
            });
        })

}
module.exports.help = MESSAGES.Commandes.Utilitaires.LEADERBOARD;
