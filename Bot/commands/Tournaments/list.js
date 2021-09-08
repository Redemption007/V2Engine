const {Util} = require('discord.js')
const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {
    let tournoi = await client.getTournoi({StaffChannelID: message.channel.id})
    let pseudos = ''
    let inscrits = ''

    if (!tournoi) tournoi = await client.getTournoi({InscriptionsChannelID: message.channel.id})
    if (!tournoi) return message.reply('Vous n\'avez pas envoyé cette commande dans la catégorie du tournoi concerné !')
    if (tournoi.Inscrits.length === 0) return message.channel.send({embeds: [{title: 'Ah...', footer: {text: "Réessayez dans quelques minutes !"}, description: 'Il n\'y a encore aucun inscrit dans ce tournoi...', color: "ORANGE"}]})
    if (tournoi.Compo === 1 || tournoi.Random) {
        await tournoi.Inscrits.forEach(e => {
            inscrits += `<@${e.members[0].userid}>\n`
            pseudos += `---> ${e.members[0].pseudo}\n`
        });

        return message.channel.send({embeds: [{title: `Liste des participants au tournoi ${tournoi.NomduTournoi} :`, color: 'BLUE', fields: [{name: 'Participants :', value: Util.splitMessage(inscrits), inline: true}, {name: 'Peudos de jeu :', value: Util.splitMessage(pseudos), inline: true}]}]})
    }
    await tournoi.Inscrits.forEach(async e => {
        inscrits += `**__Équipe n°${tournoi.Inscrits.indexOf(e)+1} :__**\n`
        pseudos += `----> ID: ${await tournoi.Inscrits[tournoi.Inscrits.indexOf(e)].id}\n`
        await e.members.forEach(mbr => {
            inscrits += `<@${mbr.userid}>\n`
            pseudos += `---> ${mbr.pseudo}\n`
        })
    });

    return message.channel.send({embeds: [{
        title: `Liste des participants au tournoi ${tournoi.NomduTournoi} :`,
        color: 'BLUE',
        fields:[
            {name: 'Équipes :', value: Util.splitMessage(inscrits), inline: true},
            {name: 'Peudos de jeu :', value: Util.splitMessage(pseudos), inline: true}
        ],
        footer: {text: `Nombre d'équipes inscrites : ${tournoi.Inscrits.length}/${tournoi.NbdeTeams}`},
        timestamp: Date.now()
    }]})
}
module.exports.help = MESSAGES.Commandes.Tournaments.LIST;
