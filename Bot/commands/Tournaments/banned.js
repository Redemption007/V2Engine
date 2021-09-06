const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (client, message) => {
    const Guild = await client.getGuild(message.guild)
    let list = ''

    if (Guild.Banned.length === 0) return message.reply("aucun utilisateur n'est banni des tournois !")
    for (let i=0; i<Guild.Banned.length; i++) {
        list += `• <@!${Guild.Banned[i]}>\n`
    }
    return message.reply({embed: {color: 'RED', title: `Utilisateur${Guild.Banned.length>1?'s':''} banni${Guild.Banned.length>1?'s':''} des tournois :`, description: list, footer: {text: `Total : ${Guild.Banned.length} utilisateur${Guild.Banned.length>1?'s':''}`}}, split: true})
}
module.exports.help = MESSAGES.Commandes.Tournaments.BANNED;
