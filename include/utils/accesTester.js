const embedGenerator = require("./embedGenerator.js");
const EventEmitter = require('events');
class accesTester extends EventEmitter {
  constructor(message, args, option) {
    super();
    this.message = message;
    this.args = args;
    this.option = option;
  }
  async startSelector() {
    switch (this.option) {
      case 'none': { if(this.MemberTester())this.emit('GRANTED'); break }
      case 'blocked': { let embed1 = await embedGenerator.run("warnings.error_06"); this.emit('DENIED', embed1); break }
      case 'music-command': { if(await this.MemberTester() && await this.QueueTester())this.emit('GRANTED'); break }
      case 'music-player': { if(await this.MemberTester() && await this.BotPlayTester() && await this.ArgsTester())this.emit('GRANTED'); break }
      case 'collector-player-command': { if(await this.CollectorTester() && await this.MemberTester() && await this.BotPlayTester() && await this.ArgsTester())this.emit('GRANTED'); break }
      case 'collector-music-command': { if(await this.CollectorTester() && await this.MemberTester() && await this.QueueTester())this.emit('GRANTED'); break }
      default: break;
    }
  }
  //====================================================================================== PACKS
  async ArgsTester() {
    let args_test = await this.testArgs();
    if (args_test) { this.emit('DENIED', args_test); return false }
    else { return true }
  }
  async QueueTester() {
    let queue_test = await this.testQueueStatus();
    if (queue_test) { this.emit('DENIED', queue_test); return false }
    else { return true }
  }
  async BotPlayTester() {
    let voice_test = await this.testUserVoiceChannelAvailability();
    if (voice_test) { this.emit('DENIED', voice_test); return false }
    let perm_test = await this.testAudioPermissions();
    if (perm_test) { this.emit('DENIED', perm_test); return false }
    let member_test = await this.testSameUserBotLoacation();
    if (member_test) { this.emit('DENIED', member_test); return false }
    else { return true }
  }
  async MemberTester() {
    let userId_test = await this.testUserId();
    if (userId_test) { this.emit('DENIED', userId_test); return false }
    else { return true }
  }
  async CollectorTester() {
    let collector_test = await this.testCollector();
    if (collector_test) { this.emit('DENIED', collector_test); return false }
    else { return true }
  }
  
  //====================================================================================== TESTERS
  async testUserId() {
    let embed1 = await embedGenerator.run("warnings.error_02");
    if (this.message.author.id === "614819288506695697" || this.message.author.id === "596967380089962496" || this.message.author.id === "468380034273509376" && !this.message.author.bot);
    else return embed1
  }
  async testUserVoiceChannelAvailability() {
    let embed1 = await embedGenerator.run("music.play.error_02");
    const voiceChannel = await this.message.member.voice.channel;
    if (!voiceChannel) return embed1;
    else this.voiceChannel = voiceChannel;
  }
  async testAudioPermissions() {
    let embed3 = await embedGenerator.run("music.play.error_03");
    let embed4 = await embedGenerator.run("music.play.error_04");
    const permissions = this.voiceChannel.permissionsFor(
      this.message.client.user
    );
    if (!permissions.has("CONNECT")) return embed3;
    if (!permissions.has("SPEAK")) return embed4;
  }
  async testCollector() {
    let embed10 = await embedGenerator.run("music.search.error_01");
    if (this.message.channel.activeCollector == true) return embed10;
  }
  async testArgs() {
    let embed7 = await embedGenerator.run("music.play.info_01");
    if (!this.args.length) return embed7;
  }
  async testSameUserBotLoacation() {
    let queue = await this.message.client.queue.get(this.message.guild.id);
    if (queue != null) {
      let embed2 = await embedGenerator.run("music.play.error_01");
      if (queue.isPlaying == true && this.voiceChannel !== this.message.guild.me.voice.channel) return embed2;
    }
  }
  async testQueueStatus() {
    let queue = this.message.client.queue.get(this.message.guild.id);
    let embed2 = await embedGenerator.run("warnings.error_03");
    if (queue == null) return embed2;
    if (queue.status !== 'playing' && queue.status !== 'paused') return embed2;
  }
}
exports.accesTester = accesTester;
