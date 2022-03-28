/* eslint-disable no-nested-ternary */
const Discord = require('discord.js')
const {readdirSync} = require('fs')
const user = require('../../modeles/user')
const {MESSAGES} = require('../../starterpack/constants')
const CategoryList = readdirSync("./Bot/commands")

module.exports.run = async (client, message, args, settings) => {
    const dbUser = await client.getUser(message.author)

    if (!args.length) { //S'il n'y a pas d'arguments, on affiche toutes les catégories possibles
        const embed = new Discord.MessageEmbed()
            .setColor("GOLD")
            .setTitle("Liste des catégories")
            .setFooter(`TIP : Pour plus d'informations sur une commande/catégorie, tapez :\n${settings.prefix}help <commande|catégorie>`)
            .setDescription('')

        for (const category of CategoryList) {
            if ((`${category}`.toLowerCase()!=='admin' || message.member.permissions.has('ADMINISTRATOR')) && (`${category}`.toLowerCase()!=='moderation' || `${category}`.toLowerCase()!=='modération' || message.member.permissions.has('KICK_MEMBERS'))) embed.description += `\n• __**${category}**__`
        }

        if (dbUser.dmable) {
            message.member.send({embeds: [embed]}).catch(() => message.reply(`Attention, vous avez indiqué au bot être joignable par DM mais ceux-ci sont désactivés !\nPour résoudre ce problème, deux solutions :\n> Activez vos DM *(Menu du serveur > Paramètres de confidentialité > Autoriser les messages privés en provenance des membres du serveur)*\n\n> Tapez \`${settings.prefix}dm false\` pour indiquer au bot que vous n'êtes pas joignable par DM`))
            return
        }

        return message.channel.send({embeds: [embed]});
    } else {
        const command = client.commands.get(args[0].toLowerCase()) ||client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0].toLowerCase()));
        const havePerms = cmd => {
            if (cmd.help.Modo && !message.member.permissions.has('KICK_MEMBERS')|| cmd.help.Admin && !message.member.permissions.has('ADMINISTRATOR') || args[0].toLowerCase() === 'owner' && !client.config.OWNERS_ID.includes(message.author.id)) return false
            return true
        }

        if (!command) {
            for (const category of CategoryList) {
                if (args[0].toLowerCase() === `${category.toLowerCase()}`) {
                    let commandlist = `${client.commands.filter(com => com.help.category === category && havePerms(com)).map(cmd => cmd.help.name).join('\n')}`
                    if (!commandlist.length) commandlist = 'Aucune commande utilisable par vous dans cette catégorie !'
                    const embed = new Discord.MessageEmbed()
                        .setColor('GOLD')
                        .setTitle(`Informations sur la catégorie ${category} :`)
                        .addField(`__Liste des commandes :__`, commandlist, true)
                        .addField('Description de la catégorie :', client.helpCategory(`${category}`.toLowerCase()), true)

                    if (dbUser.dmable) {
                        message.member.send({embeds: [embed]}).catch(() => message.reply(`Attention, vous avez indiqué au bot être joignable par DM mais ceux-ci sont désactivés !\nPour résoudre ce problème, deux solutions :\n> Activez vos DM *(Menu du serveur > Paramètres de confidentialité > Autoriser les messages privés en provenance des membres du serveur)*\n\n> Tapez \`${settings.prefix}dm false\` pour indiquer au bot que vous n'êtes pas joignable par DM`))
                        return
                    }

                    return message.channel.send({embeds: [embed]})
                }
            }
            if (args[0].toLowerCase() === 'owner' && client.config.OWNERS_ID.includes(message.author.id)) {
                let commandlist = `${client.commands.filter(com => com.help.category.toLowerCase()=== 'owner').map(cmd => cmd.help.name).join('\n')}`
                const embed = new Discord.MessageEmbed()
                    .setColor('GOLD')
                    .setTitle(`Informations sur la catégorie Owner :`)
                    .addField(`__Liste des commandes :__`, commandlist, true)
                    .addField('Description de la catégorie :', client.helpCategory('owner'), true)
                if (dbUser.dmable) {
                    message.member.send({embeds: [embed]}).catch(() => message.reply(`Attention, vous avez indiqué au bot être joignable par DM mais ceux-ci sont désactivés !\nPour résoudre ce problème, deux solutions :\n> Activez vos DM *(Menu du serveur > Paramètres de confidentialité > Autoriser les messages privés en provenance des membres du serveur)*\n\n> Tapez \`${settings.prefix}dm false\` pour indiquer au bot que vous n'êtes pas joignable par DM`))
                    return
                }
                return message.channel.send({embeds: [embed]})
            }
            if (dbUser.dmable) {
                message.member.send(`<@${user.id}>, cette commande ou catégorie n'existe pas !`).catch(() => message.reply(`Attention, vous avez indiqué au bot être joignable par DM mais ceux-ci sont désactivés !\nPour résoudre ce problème, deux solutions :\n> Activez vos DM *(Menu du serveur > Paramètres de confidentialité > Autoriser les messages privés en provenance des membres du serveur)*\n\n> Tapez \`${settings.prefix}dm false\` pour indiquer au bot que vous n'êtes pas joignable par DM`))
                return
            }

            return message.reply("Cette commande ou catégorie n'existe pas !");
        }
        if (!havePerms(command)) {
            if (dbUser.dmable) {
                message.member.send("Vous n'avez pas les permissions nécessaire pour cette commande !").catch(() => message.reply(`Attention, vous avez indiqué au bot être joignable par DM mais ceux-ci sont désactivés !\nPour résoudre ce problème, deux solutions :\n> Activez vos DM *(Menu du serveur > Paramètres de confidentialité > Autoriser les messages privés en provenance des membres du serveur)*\n\n> Tapez \`${settings.prefix}dm false\` pour indiquer au bot que vous n'êtes pas joignable par DM`))
                return
            }
            return message.reply("Vous n'avez pas les permissions nécessaire pour cette commande !")
        }
        const embed = new Discord.MessageEmbed()
            .setColor("GOLD")
            .setTitle(`Aide à la commande ${command.help.name}`)
            .setDescription(`Description : ${command.help.description}`)
            .addField(`Cooldown :`, `${command.help.cooldown} secondes`, false)
            .addField('Usage :', `\`${settings.prefix}${command.help.usage}\``, true)
            .setFooter("Légende : < > signifie obligatoire ; [ ] signifie optionnel")

        if (command.help.aliases.length >1 ) {
            embed.addField('Aliases :', command.help.aliases.slice(1).join('\n'), true)
        }
        embed.addField('Permissions :', command.help.category==='Owner'? 'Bot Owners uniquement' : command.help.Admin? 'Administrateurs uniquement' : command.help.Modo? 'Modérateurs et + uniquement' : 'Tout le monde', false)
        // command.category.toLowerCase()==='owner'? embed.addField('Permissions :', 'Bot Owners uniquement', false) :command.help.Admin? embed.addField('Permissions :', 'Administrateurs uniquement', false) : command.help.Modo? embed.addField('Permissions :', 'Modérateurs et + uniquement', false) : embed.addField('Permissions :', 'Tout le monde', false)

        if (dbUser.dmable) {
            message.member.send({embeds: [embed]}).catch(() => message.reply(`Attention, vous avez indiqué au bot être joignable par DM mais ceux-ci sont désactivés !\nPour résoudre ce problème, deux solutions :\n> Activez vos DM *(Menu du serveur > Paramètres de confidentialité > Autoriser les messages privés en provenance des membres du serveur)*\n\n> Tapez \`${settings.prefix}dm false\` pour indiquer au bot que vous n'êtes pas joignable par DM`))
            return
        }

        return message.channel.send({embeds: [embed]})
    }
}
module.exports.help = MESSAGES.Commandes.Helper.HELP;
