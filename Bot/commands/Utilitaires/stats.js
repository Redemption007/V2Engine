const {MESSAGES} = require('../../starterpack/constants')

module.exports.run = (_client, message) => {
    message.guild.members.fetch({withPresences: true}).then(AllMembers => {
        const idle = AllMembers.filter(member => member.presence && member.presence.status === 'idle' && !member.user.bot)
        const dnd = AllMembers.filter(member => member.presence && member.presence.status === 'dnd' && !member.user.bot)
        const online = AllMembers.filter(member => member.presence && member.presence.status === 'online' && !member.user.bot)
        const bots = AllMembers.filter(member => member.user.bot)
        const offlineCount = AllMembers.size - idle.size - dnd.size - online.size - bots.size

        message.channel.send({embeds: [{title: "Présence globale :", color: 'LUMINOUS_VIVID_PINK', description: `Il y a actuellement ${AllMembers.size - bots.size} personnes sur ce serveur dont :\n- ${online.size} connectées.\n- ${dnd.size} en mode "Ne pas déranger".\n - ${idle.size} AFK.\n- ${offlineCount} déconnectées.\n\n*Ce serveur héberge en plus ${bots.size} bots.*`}]})
    })
}
module.exports.help = MESSAGES.Commandes.Utilitaires.STATS;