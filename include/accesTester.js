const embedGenerator = require("../include/embedGenerator.js");
class accesTester {
  constructor(message, args) {
    this.message = message;
    this.args = args;
  }

  testAudioAcces() {
    let testAudioAcces = new Promise(async (resolve, reject) => {
      let voice_test = await this.testVoiceChannel();
      if (voice_test != null) {
        await reject(voice_test);
        return 0;
      }
      let perm_test = await this.testPermissions();
      if (perm_test != null) {
        await reject(perm_test);
        return 0;
      }
      let args_test = await this.testArgs();
      if (args_test != null) {
        await reject(args_test);
        return 0;
      }
      let member_test = await this.testMember();
      if (member_test != null) {
        await reject(member_test);
        return 0;
      }
      else{resolve('acces_granted')}
    });
    return testAudioAcces;
  }
  testAdioWArgsAcces() {
    let testAudioAcces = new Promise(async (resolve, reject) => {
      let voice_test = await this.testVoiceChannel();
      if (voice_test != null) {
        await reject(voice_test);
        return 0;
      }
      let perm_test = await this.testPermissions();
      if (perm_test != null) {
        await reject(perm_test);
        return 0;
      }
      let member_test = await this.testMember();
      if (member_test != null) {
        await reject(member_test);
        return 0;
      }
      let queue_test = await this.testQueue();
      if (queue_test != null) {
        await reject(queue_test);
        return 0;
      }
      else{resolve()}
    });
    return testAudioAcces;
  }

  async testVoiceChannel() {
    let embed1 = await embedGenerator.run("music.play.error_02");
    const voiceChannel = await this.message.member.voice.channel;
    if (!voiceChannel) return embed1;
    else this.voiceChannel = voiceChannel;
  }

  async testPermissions() {
    let embed3 = await embedGenerator.run("music.play.error_03");
    let embed4 = await embedGenerator.run("music.play.error_04");
    const permissions = this.voiceChannel.permissionsFor(
      this.message.client.user
    );
    if (!permissions.has("CONNECT")) return embed3;
    if (!permissions.has("SPEAK")) return embed4;
  }

  async testArgs() {
    let embed7 = await embedGenerator.run("music.play.info_01");
    if (!this.args.length) return embed7;
  }

  async testMember() {
    let queue = await this.message.client.queue.get(this.message.guild.id)
    if(queue != null){
    let embed2 = await embedGenerator.run("music.play.error_01");
    if (queue.isPlaying == true && this.voiceChannel !== this.message.guild.me.voice.channel) return embed2;
    }
  }
  async testQueue() {
    let queue = this.message.client.queue.get(this.message.guild.id)
    let embed2 = await embedGenerator.run("warnings.error_03");
    if(queue == null) return embed2;
    if(queue.isPlaying == false) return embed2;
  }
  /* testMember(client:object, channel:object, args?:string){

    }
    testQueue(client:object, channel:object, args?:string){

    }*/
}
exports.accesTester = accesTester;
