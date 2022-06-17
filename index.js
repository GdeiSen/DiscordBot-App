const { Client, Collection, Intents, VoiceRegion } = require("discord.js");
const { AccessTester } = require("./utils/commandMiddleware");
const { ExtServerEngine } = require("./external_server/managers/connectionManager");
const { MusicPlayer } = require("./musicPlayer");
const guildParamsUtil = require('./utils/guildParamsUtil');
const fs = require("fs");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
const config = require("./config.json");
client.musicPlayer = new MusicPlayer(client);
client.commands = new Collection();
client.aliases = new Collection();
client.guildParams = new Collection();
client.categories = new Collection();
client.queue = new Map();
client.prefix = config.PREFIX;
client.login(process.env?.TOKEN || config.TOKEN);
console.clear();
client.once("ready", async () => {
  guildParamsUtil.createParams(client);
  console.log(`⬜ Main Manager Is Enable`);
  client.user.setActivity(`Type ${config.PREFIX}help`, {
    type: "STREAMING",
  });
  if (config.USE_EXTERNAL_SERVER == true) {
    client.extServerManager = new ExtServerEngine(client);
    client.extServerManager.connect();
    client.extServerManager.createRouter();
  }
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

client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.author.bot || message.channel.type === "dm") return;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = message.content.split(' ').slice(1).join();
  let params = client.guildParams.get(message.guild.id);
  if (!message.content.startsWith(client.prefix) && !message.content.startsWith(params?.prefix)) return;
  let commandfile = client.commands.get(cmd.slice(message.content.startsWith(client.prefix) ? client.prefix.length : params.prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(message.content.startsWith(client.prefix) ? client.prefix.length : params.prefix.length)))
  try {
    let tester = new AccessTester(client, message.guild)
    tester.test(message, args, commandfile.config.accesTest);
    tester.on('DENIED', (error) => { message.channel.send({ embeds: [error] }) })
    tester.on('GRANTED', () => { try { commandfile.run(client, message, args) } catch (err) { return 0 } })
  } catch (error) { return }
})
