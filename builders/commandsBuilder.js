const fs = require("fs");

exports.CommandsBuilder = class CommandsBuilder {

    constructor(client) {
        this.client = client;
    }

    executeCommandListeners(guild) {
        if (guild) {
            this.client.commands.map(command => {
                if (command?.addListeners) command.addListeners(guild)
            })
        }
        else {
            let guilds = this.client.guilds.cache;
            guilds.map(guild => {
                this.client.commands.map(command => {
                    if (command?.addListeners) command.addListeners(guild)
                })
            })
        }
    }

    scanCommands(path) {
        const commandFiles = fs.readdirSync(`${path}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`.${path}/${file}`);
            command.data.run = command?.run;
            command.data.addListeners = command.addListeners
            if (command?.data) this.client.commands.push(command.data);
        }
    }

    scanCategories() {
        let buf = new Array();
        let index = 0;
        this.client.commands.forEach(command => {
            if (index == 0) { buf[0] = command.category; index++ }
            else {
                if (!buf.find(el => el == command.category)) { buf.push(command.category); index++ }
            }
        })
        this.client.categories = buf;
    }

    async refreshSlashCommands() {
        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: client.commands },
            );
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }

}