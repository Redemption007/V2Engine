const {MESSAGES} = require("../../starterpack/constants");

module.exports.run = async (client, message, args) => {
    function clean (text) {

        if (typeof text === "string") {

            return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
        }

        return text;
    }

    if (message.author.id !== "554344205405650957" && message.author.id !=="781109649730043965") return message.reply("seul l'owner du bot peut exécuter cette commande !");
    const code = args.join(" ");
    const evaled = eval(code);
    const cleanCode = await clean(evaled);

    message.channel.send(`\`\`\`js\n${cleanCode}\`\`\``);
};

module.exports.help = MESSAGES.Commandes.Admin.EVAL;
