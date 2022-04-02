module.exports = client => {
    require('./errors')(client)

    require('./guilds')(client);

    require('./others')(client);

    require('./reactors')(client);

    require('./tournaments')(client);

    require('./users')(client);

    require('./voices')(client);
}