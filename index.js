const { Client, Collection, Intents } = require("discord.js");
const { accesTester } = require("./include/utils/accesTester");
const { ExtServerEngine } = require("./include/ext_server_engine/serverManager");
const { FileSystemManager } = require("./include/utils/fileSystemManager.js");
const fs = require("fs");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const config = require("./config.json");
const package = require("./package.json")
client.extServerEngine = new ExtServerEngine(client);
client.commands = new Collection();
client.aliases = new Collection();
client.categories = new Collection();
client.queue = new Map();
client.fileSystemManager = new FileSystemManager();
client.prefix = config.PREFIX;
client.login(config.TOKEN);
console.clear();
client.once("ready", () => {
  console.log(`⬜ Main Manager Is Enable`);
  let flag = true;
  setInterval(() => {
    if (flag == true) client.user.setActivity(`${package.version}`, { type: "PLAYING" });
    else client.user.setActivity(`IN DEVELOPMENT`, { type: "PLAYING" });
    flag = !flag;
  }, 5000);
  try {
    client.extServerEngine.createConnect();
    client.fileSystemManager.createDefFiles();
  } catch (error) { console.log(error) }
});

scanCommands('./commands/music/');
scanCommands('./commands/entertainment/');
scanCommands('./commands/administration/');

function scanCommands(path) {
  fs.readdir(path, (err, files) => {
    console.log(`⬜️​ Commands Scan On Path: "${path}"`)
    if (err) console.log(err)
    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) {
      return console.log("🟥 Unable To Find Commands");
    }
    jsfile.forEach((f, i) => {
      let pull = require(`${path}${f}`);
      client.commands.set(pull.config.name, pull);
      pull.config.aliases.forEach(alias => {
        client.aliases.set(alias, pull.config.name)
      });
      let buf = new Array();
      let index = 0;
      client.commands.forEach(element => {
        if (index == 0) { buf[0] = element.config.category; index++ }
        else {
          if (!buf.find(el => el == element.config.category)) { buf.push(element.config.category); index++ }
        }
      })
      client.categories = buf;
    });
  });
}
client.on('guildDelete', () => {
  client.dataBaseEngine.updateServerData();
  client.dataBaseEngine.updateUserData();
})

client.on('guildCreate', () => {
  client.dataBaseEngine.updateServerData();
  client.dataBaseEngine.updateUserData();
})

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.author.bot || message.channel.type === "dm") return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = message.content.split(' ').slice(1).join();
  if (!message.content.startsWith(client.prefix)) return;
  let commandfile = client.commands.get(cmd.slice(client.prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(client.prefix.length)))
  try {
    const tester = new accesTester(message, args, commandfile.config.accesTest);
    tester.on('DENIED', (error) => { message.channel.send({ embeds: [error] }) })
    tester.on('GRANTED', () => { commandfile.run(client, message, args) })
    await tester.startSelector();
  } catch (error) { return }

})

