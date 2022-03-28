const fs = require('fs');

const loadCommands = ( client, dir = "./Bot/commands/") => {
    console.log('\nCOMMANDES :');
    fs.readdirSync(dir).forEach(dirs => {
        const commands = fs.readdirSync(`${dir}/${dirs}/`).filter( files => files.endsWith(".js"));

        for (const file of commands) {
            const getFileName = require(`../../${dir}/${dirs}/${file}`);

            client.commands.set(getFileName.help.name, getFileName);
            console.log(`Commande chargée : ${getFileName.help.name}`);
        }
    })
}

const loadEvents = ( client, dir = "./Bot/events/") => {
    console.log('\nEVENEMENTS :');
    fs.readdirSync(dir).forEach(dirs => {
        const events = fs.readdirSync(`${dir}/${dirs}/`).filter( files => files.endsWith(".js"));

        for (const event of events) {
            const evt = require(`../../${dir}/${dirs}/${event}`);
            const EventName = event.split(".")[0]

            client.on(EventName, evt.bind(null, client))
            console.log(`Evènement chargé : ${EventName}`);
        }
    })
}

module.exports = {
    loadCommands,
    loadEvents,
}
