const {MESSAGES} = require("../../starterpack/constants");

module.exports.run = async (client, message, args) => {
    function clean (text) {

        if (typeof text === "string") {

            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        }

        return text;
    }

    if (!client.config.OWNERS_ID.includes(message.author.id)) return message.reply("seul les owners du bot peuvent exécuter cette commande !");
    const code = args.join(" ");
    const evaled = eval(code);
    const cleanCode = await clean(evaled);

    message.channel.send(`\`\`\`js\n${cleanCode}\`\`\``);
};

module.exports.help = MESSAGES.Commandes.Admin.EVAL;
