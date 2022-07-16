module.exports.Scanner = class Scanner {

    scanCommands(path, commands) {
        const commandFiles = fs.readdirSync(`../${path}`).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../${path}/${file}`);
            command.data.run = command.run;
            if (command?.data) commands.push(command.data);
        }
    }

    scanCategories(client, commands) {
        let buf = new Array();
        let index = 0;
        commands.forEach(command => {
            if (index == 0) { buf[0] = command.category; index++ }
            else {
                if (!buf.find(el => el == command.category)) { buf.push(command.category); index++ }
            }
        })
        client.categories = buf;
    }

}
