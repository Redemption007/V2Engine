const {loadEvents, loadCommands} = require('./Bot/starterpack/loader');
const discord = require('discord.js');
const intents = new discord.Intents(discord.Intents.ALL)
const client = new discord.Client(
    {
        partials: ["MESSAGE", "CHANNEL", "REACTION"],
        ws: {intents: intents}
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
