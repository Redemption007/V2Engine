const {MESSAGES} = require('../../starterpack/constants')
const {MessageAttachment} = require('discord.js')

module.exports.run = async (_client, message) => {
    const photo1 = new MessageAttachment('https://media.discordapp.net/attachments/754046324953055413/915036244751298570/explications_1.jpg', "explications_1.png")
    await message.channel.send({content: '<@'+message.author+">\n> __***Comment faire pour récupérer votre tag BrawlStars ?***__\n\
> C'est très simple !\n\
__**Étape 1/2 -**__ Pour ce faire, il vous suffit d'aller sur votre application préférée ||j'ai nommé : Brawl Stars, of course|| et de cliquer en haut à gauche ainsi que l'indiquent les flèches rouges de la photo ci dessous :", files: [photo1]})
    const photo2 = new MessageAttachment('https://media.discordapp.net/attachments/754046324953055413/915036355053113374/explications_2.jpg', "explications_2.png")
    return message.channel.send({content: "__**Étape 2/2 -**__ Ensuite, il vous suffit de recopier ce qui se trouve sous votre log de profil, comme l'indiquent à nouveau les flèches rouges. Ici, par exemple, le tag de l'utilisateur LED RedэмρŦĩ๏Ŋ est `#2JPCLPP2Y`\n<@"+message.author+'>', files: [photo2]})
}
module.exports.help = MESSAGES.Commandes.BrawlStars.TAG;