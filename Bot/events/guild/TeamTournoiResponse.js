/* eslint-disable no-case-declarations */

const {Reactor} = require("../../modeles/reactor")
// eslint-disable-next-line no-unused-vars

module.exports = async (client, MessageReaction, user) => {
    const emoji = await MessageReaction.emoji.name
    const Message = await MessageReaction.message.channel.messages.fetch(MessageReaction.message.id)
    const data = await Reactor.findOne(r => r.autre.find(chid => chid === MessageReaction.channel.id))

    if (!data || data.typeReactor !== 'Tournoi'|| !data.emojis.find(emoji)) return
    const one = await data.msgReactor
    
    switch (emoji) {
    case '✅':
        const tournoi = await data.typeAction[0]
        const full = await tournoi.Inscrits.find(team => team.members.find(us => us.userid === user.id))

        if (full.members.length >= tournoi.compo) return user.send({embed: {title: 'Oops !', description: 'Votre équipe est déjà complète, vous ne pouvez pas accepter ce membre !', color: 'RED'}})

        await client.deleteReactor(one, 'all')
        const guild = await client.guilds.fetch(tournoi.guildID)
        const Guild = await client.getGuild(guild)
        const teammate = await guild.members.fetch(one.userid)
        const team = await tournoi.Inscrits.find(Team => Team.members.first().userid === user.id)

        await client.registerTournoi(tournoi, {teamid: team.id, userid: one.userid, pseudo: one.pseudo})
        await Message.delete()

        return teammate.send({embed: {color: 'GREEN', title: 'Victoire !', description: `<@${user.id}> vous a accepté dans son équipe ! Tapez la commande \`${Guild.prefix}team\` pour en connaître la composition.`}})
    case '❌':
        const index = await data.autres.findIndex(Message.id)

        await data.autres.splice(index, 1)
        await user.send(`Vous avez refusé la proposition de <@${one.userid}> alias ${one.pseudo} avec succès.`)
        await Message.delete()

        return data.save()
    }
}
