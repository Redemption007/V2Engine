const {loadEvents, loadCommands} = require('./Bot/starterpack/loader');
const discord = require('discord.js');
const intents = new discord.Intents()
intents.add([discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MEMBERS, discord.Intents.FLAGS.GUILD_BANS, discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, discord.Intents.FLAGS.GUILD_INTEGRATIONS, discord.Intents.FLAGS.GUILD_WEBHOOKS, discord.Intents.FLAGS.GUILD_INVITES, discord.Intents.FLAGS.GUILD_VOICE_STATES, discord.Intents.FLAGS.GUILD_PRESENCES, discord.Intents.FLAGS.GUILD_MESSAGES, discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, discord.Intents.FLAGS.GUILD_MESSAGE_TYPING, discord.Intents.FLAGS.DIRECT_MESSAGES, discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING])
const client = new discord.Client(
    {
        partials: ["MESSAGE", "USERS", "GUILD_MEMBER", "CHANNEL", "REACTION"],
        intents: intents
    });
require('./Bot/util/index')(client);
client.config = require('./Bot/starterpack/parametres')
client.mongoose = require('./Bot/starterpack/mongoose');

const coll = [
    'commands',
    'cooldowns'
];

coll.forEach( x => client[x] = new discord.Collection());


loadCommands(client);
loadEvents(client);

client.mongoose.init();

client.login(client.config.TOKEN);
