const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message, _args, settings) => {
    let tournoi = await client.getTournoi({StaffChannelID: message.channel.id})

    if (!tournoi) tournoi = await client.getTournoi({InscriptionsChannelID: message.channel.id})
    const member = await message.mentions.members.first()
    const filterReaction = reaction => reaction.users.fetch(message.author.id) && ['✅', '❌'].includes(reaction._emoji.name)

    if (!member) return message.reply(`Vous devez mentionner un utilisateur pour cette commande ! Utilisation de la commande : ${settings.prefix}forceunregister @user`)
    if (!tournoi) return message.reply('Vous n\'avez pas envoyé cette commande dans le salon staff du tournoi concerné !')

    message.reply("Êtes-vous sûr de vouloir désinscrire ce membre du tournoi ?")
        .then(async msg => {
            msg.react('✅')
            msg.react('❌')
            await msg.awaitReactions({filter: filterReaction, max: 1, idle: 30000, errors: ['time']})
                .then(async coll => {
                    const emoji = await coll.first()._emoji.name

                    if (emoji === '❌') {
                        await message.reply("La commande a été annulée.")

                        //return msg.delete()
                    }
                    await msg.delete()
                    try {
                        await client.unregisterTournoi(tournoi, member)
                    } catch (e) {
                        return message.reply(`Le membre mentionné doit être inscrit au tournoi ! Obtenez la liste des membres inscrits en tapant \`${settings.prefix}list\``)
                    }

                    return message.channel.send({embeds: [{title: 'Désinscription réussie !', color: 'PURPLE', description: `Le membre <@${member.id}> à été désinscrit du tournoi avec succès`}]})
                })
                .catch(() => {
                    message.reply('Merci de bien vouloir réagir avant Noël')

                    //return msg.delete()
                })
        })
}
module.exports.help = MESSAGES.Commandes.Tournaments.FORCEUNREGISTER;
