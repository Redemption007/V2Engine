const {MESSAGES} = require('../../starterpack/constants')


module.exports.run = async (client, message) => {
    let Page = 0
    let position = 1
    let Utilisateurs =''
    let Niveaux = ''
    const guild = await client.getGuild(message.guild)
    const allUsers = guild.leaderboard
    const nbr_par_page = 10
    const Nbpages = Math.ceil(allUsers.length / nbr_par_page)   
    const afficherPage = (MESSAGE, PAGE, POSITION) => {
        Utilisateurs = ''
        Niveaux = ''
        for (let i=nbr_par_page*PAGE; i<Math.min(allUsers.length, nbr_par_page*(PAGE+1)); i++) {
            Utilisateurs += `${POSITION}- <@${allUsers[i][0]}> : ${client.arrondir(allUsers[i][1])} points d'xp\n\n`;
            Niveaux += `__Niveau :__ ${Math.floor(0.63*Math.log(allUsers[i][1]))}\n\n`;
            POSITION += 1;
        }
        return MESSAGE.edit({embeds: [{
            color: 'DARK_RED',
            title: 'Classement des utilisateurs du serveur',
            fields: [
                {name: 'Utilisateurs', value: Utilisateurs, inline: true},
                {name: 'Niveaux', value: Niveaux, inline: true}
            ],
            footer: {text: `Page ${Page+1}/${Nbpages} du classement demandé par ${message.member.nickname||message.author.username}`, icon_url: message.author.avatarURL()}
        }]})
    }

    const msg = await message.channel.send({embeds: [{title: 'Classement des utilisateurs du serveur', color: 'DARK_RED'}]})

    afficherPage(msg, Page, position).then(async lb => {
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
                position = 1+nbr_par_page*Page
                await afficherPage(lb, Page, position)
                break
            case '⏹️':
                collector.stop()
                break
            case '▶️':
                r.users.remove(r.users.cache.filter(usr => !usr.bot ).first().id)
                Page === Nbpages-1 ? Page = 0 : Page += 1;
                position = 1+nbr_par_page*Page
                await afficherPage(lb, Page, position)
                break
            }
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
