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
            .setFooter(`TIP : Pour plus d'informations sur une commande/catégorie, tapez "${settings.prefix}help <commande|catégorie>"`)

        for (const category of CategoryList) {
            if (`${category}`.toLowerCase()!=='admin' || message.member.hasPermission('ADMINISTRATOR') && (`${category}`.toLowerCase()!=='moderation' || `${category}`.toLowerCase()!=='modération') || message.member.hasPermission('KICK_MEMBERS')) embed.description += `\n• __**${category}**__`
        }

        if (dbUser.dmable) return message.member.send(embed)

        return message.channel.send(embed);
    } else {
        const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(args[0].toLowerCase()));
        const havePerms = cmd => {
            if (cmd.help.Modo && !message.member.hasPermission('KICK_MEMBERS')) return false
            if (cmd.help.Admin && !message.member.hasPermission('ADMINISTRATOR')) return false
            return true
        }

        if (!command) {
            for (const category of CategoryList) {
                if (args[0].toLowerCase() === `${category}`) {
                    let commandlist = `${client.commands.filter(cat => cat.help.category === category && havePerms(cat)).map(cmd => cmd.help.name).join('\n')}`
                    if (!commandlist.length) commandlist = 'Aucune commande utilisable par vous dans cette catégorie !'
                    const embed = new Discord.MessageEmbed()
                        .setColor('GOLD')
                        .setTitle(`Informations sur la catégorie ${category} :`)
                        .addField(`__Liste des commandes :__`, commandlist, true)
                        .addField('Description de la catégorie :', client.helpCategory(`${category}`.toLowerCase()), true)

                    if (dbUser.dmable) return message.member.send(embed)

                    return message.channel.send(embed)
                }
            }
            if (args[0].toLowerCase() === 'owner' && (message.author.id === '554344205405650957' || message.author.id === '781109649730043965')) {
                let commandlist = `${client.commands.filter(cat => cat.help.category.toLowerCase() === 'owner' && havePerms(cat)).map(cmd => cmd.help.name).join('\n')}`
                const embed = new Discord.MessageEmbed()
                    .setColor('GOLD')
                    .setTitle(`Informations sur la catégorie Owner :`)
                    .addField(`__Liste des commandes :__`, commandlist, true)
                    .addField('Description de la catégorie :', client.helpCategory('owner'), true)

                if (dbUser.dmable) return message.member.send(embed)
            }
            if (dbUser.dmable) return message.member.send(`<@${user.id}>, cette commande ou catégorie n'existe pas !`)

            return message.reply("cette commande ou catégorie n'existe pas !");
        }
        if (!havePerms(command)) {
            if (dbUser.dmable) return message.member.send("vous n'avez pas les permissions nécessaire pour cette commande !")
            return message.reply("vous n'avez pas les permissions nécessaire pour cette commande !")
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
        command.help.Admin? embed.addField('Permissions :', 'Administrateurs uniquement', false) : command.help.Modo? embed.addField('Permissions :', 'Modérateurs uniquement', false) : embed.addField('Permissions :', 'Tout le monde', false)

        if (dbUser.dmable) return message.member.send(embed)

        return message.channel.send(embed)
    }
}
module.exports.help = MESSAGES.Commandes.Helper.HELP;
