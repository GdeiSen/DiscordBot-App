const config = require("./config.json");
module.exports = function (client) {
    const guild = client.guilds.cache.get(config.guildid);
    let people = guild.members.count
    console.log(people);
}