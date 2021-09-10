const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = async (_client, message) => {
    await message.guild.fetch()
    console.log(message.member.presence);
    message.guild.members.fetch().then(AllMembers => {
        console.log(AllMembers);
        const offline = AllMembers.filter(member => member.presence.status === "offline" && !member.user.bot)
        const idle = AllMembers.filter(member => member.presence.status === 'idle' && !member.user.bot)
        const dnd = AllMembers.filter(member => member.presence.status === 'dnd' && !member.user.bot)
        const online = AllMembers.filter(member => member.presence.status === 'online' && !member.user.bot)
        const bots = AllMembers.filter(member => member.user.bot)

        message.channel.send({embeds: [{title: "Présence globale :", color: 'LUMINOUS_VIVID_PINK', description: `Il y a actuellement ${AllMembers.size - bots.size} personnes sur ce serveur dont :\n- ${online.size} connectées.\n- ${dnd.size} en mode "Ne pas déranger".\n - ${idle.size} AFK.\n- ${offline.size} déconnectées.\n\n*Ce serveur héberge en plus ${bots.size} bots.*`}]})
    })
}
module.exports.help = MESSAGES.Commandes.Utilitaires.STATS;
