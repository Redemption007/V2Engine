module.exports = async (client, guild) => {
    await client.createGuild({
        guildID: guild.id,
        guildName: guild.name,
    })
    const gChan = await client.getGeneralChannel(guild)

    gChan.send({embeds: [{title: 'Bonjour à tous !', description: "Ce message s'adresse aux administrateurs du serveur :", color: 'PURPLE', timestamp: Date.now(), fields: [{name: 'Informations du bot :', value: `ID : 705476031162613790\nPing : <@!705476031162613790>\nPréfixe de base : \`.\`\nDéveloppé par : RedэмρŦĩ๏Ŋ#7777`}, {name: 'Set up :', value: "Merci de faire la commande `.setup` pour enregistrer les informations principales nécessaires au fonctionnement du bot."}]}]})
}
