const { Queue } = require("../objects/queue")
const play = require('play-dl');
const config = require('../../../config.json')
const EventEmitter = require('events');
class QueueManager extends EventEmitter {

  constructor(client, queue, guild) {
    super();
    this.client = client;
    this.fileSystemManager = client.fileSystemManager;
    this.queue = queue;
    this.guild = guild;
    this.status = 'pending';
    this.buffer = [];
    // play.setToken({ youtube: { cookie: 'YSC=3sLnJ5VVdxw; VISITOR_INFO1_LIVE=wPyzU5qPOmU; HSID=A4tVSjJSV3FA_Q7MH; SSID=APqQia2ikcfwUgFQD; APISID=0M4OR2RVlN7BtA3L/AaUjIGTC2zeaGyRiD; SAPISID=SYKRUYNz26JN-SSF/AAKP_8ukEM-rw25Je; __Secure-1PAPISID=SYKRUYNz26JN-SSF/AAKP_8ukEM-rw25Je; __Secure-3PAPISID=SYKRUYNz26JN-SSF/AAKP_8ukEM-rw25Je; LOGIN_INFO=AFmmF2swRAIgKuoFsle0PioQhM7OxcpwDCT_WPZV0wPv_NGmGyK289QCIE2mrYk0xx1Gabs1yo2UKcC-dmOIViExHuEpB4kyVkRx:QUQ3MjNmeHNMNHdwVnNNQTNfMEZRYzJiRGNzUFZUazNxZTJWVWdmWWR1QzR0eXZ5eHpGczBRd0F1TE0tdVcxdjFMck9MR3ZtOG9RS09rV0Q1TWJ4anZSM1VhdW9NYnhSSlV2UUJBZ19RVlB3X3VhREs3OGRWM2JXVWlFMFlWWnZYU1U5TEhoWVRRY0gzYWRqRjdLY2ZFTXVySjhueTlkZXdR; wide=1; SID=FQj4xdXqr5YDaCEJyn2ayleC3CxxcDthCFxMCGpRwVkS8RvVCT64QrWnzBaQobG9W1v3fA.; __Secure-1PSID=FQj4xdXqr5YDaCEJyn2ayleC3CxxcDthCFxMCGpRwVkS8RvVnERZ1Cc_5W9dcnrhlRfHhQ.; __Secure-3PSID=FQj4xdXqr5YDaCEJyn2ayleC3CxxcDthCFxMCGpRwVkS8RvVz6pZQGte6iWJzXUs1Wryqw.; PREF=f6=40000080&tz=Europe.Moscow&f5=30000; SIDCC=AJi4QfGuNE21n2QwbG-0WzMzKF4h0QHkL7RNXUcUmivnRbfSjl-lZZq2ZjUybfKtqS1ln6Q9rQ; __Secure-3PSIDCC=AJi4QfG9Z9SiS6iwTL_DZMr1rT-7vYYf5-2HzJFogEs8zy2OSsm7vRQ7Xk45Uz-VEJC1fYVtTA' } })
  }

  queueSongsChanger() {
    try {
      if (this.queue.current && ((this.queue.config.loop == true && this.queue.songs.length == 0) || this.queue.current.loop == true)) {
        return 0;
      }
      else if (this.queue.config.loop == true) {
        let buffer = this.queue.current;
        this.queue.current = this.queue.songs[0];
        this.queue.songs.splice(0, 1);
        this.queue.songs.push(buffer)
      }
      else {
        this.queue.current = this.queue.songs[0];
        this.queue.songs.splice(0, 1);
      }
    } catch (err) { this.emit('ERROR', '[ERROR] [PL] queueSongsChanger function error'); return 0 }
  }

  async clearQueue() {
    try {
      this.queue = this.client.musicPlayer.getQueue(this.guild);
      if (this.queue == null) return 0;
      this.queue.songs = [];
      this.queue.current = null;
      this.queue.config.loop = false;
    } catch (err) { this.emit('ERROR', "[ERROR] [QM] clearQueue function error!"); console.log(err); }
  }

  async addSongToBuffer(song, option) {
    try {
      this.buffer.push(song);
    } catch (error) {
      this.emit('ERROR', "[ERROR] [QM] getYTSongUrl function error!");
    }
  }

  async pushBufferToQueue(buffer, option) {
    try {
      this.queue.songs = this.queue.songs.concat(buffer);
    } catch (error) {
      this.emit('ERROR', "[ERROR] [QM] pushBufferToQueue function error!");
    }
  }

  async pushSongToQueue(song) {
    try {
      this.queue.songs.push(song);
    } catch (error) { }
  }

  async pushSongsToQueue(songs) {
    try {
      if(!songs && songs?.length == 0) return 0;
      this.queue.songs = this.queue.songs.concat(songs);
    } catch (error) { console.log(error)}
  }


}
exports.QueueManager = QueueManager;