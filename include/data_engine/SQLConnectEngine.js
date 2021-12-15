const { Sequelize, DataTypes } = require('sequelize');
const EventEmitter = require('events');
const { createServerModel, getServerData } = require('../data_engine/tables/Servers');
const { createUserModel, getUserData } = require('../data_engine/tables/Users');
const { createCurrentPlayback, getCurrentPlaybackData } = require('./tables/CurrentPlayback')
const { createServerQueue, getServerQueueData } = require('./tables/ServerQueue')
const config = require('../../config.json')
class DataBase extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
  }

  async createConnection(option) {
    try {
      this.sequelize = new Sequelize(config.SQL_SERVER_DB_NAME, config.SQL_SERVER_USER_NAME, config.SQL_SERVER_USER_PASSWORD, {
        dialect: config.SQL_SERVER_DIALECT,
        host: config.SQL_SERVER_HOST,
        logging: false,
      });
      await this.sequelize
        .authenticate()
        .then(() => { console.log('⬜ Data Base Connection Is Enable'); this.status = 'online'; })
        .catch(error => { console.error('🟥 Unable to connect to the database:', error); this.status = 'offline'})
      this.#createServerModel().then(() => this.updateServerData());
      this.#createUserModel().then(() => this.updateUserData());
      this.#createCurrentPlaybackModel().then(() => this.updateCurrentPlaybackData());
      this.#createServerQueueModel().then(() => this.updateServerQueueData());
    } catch (error) { console.log('🟥 Data Base Connection Error!'); this.status = 'offline'; this.emit('CHANGE')}
  }

  #pushDataToModel(model, data) {
    try {
      model.bulkCreate(data);
    } catch (error) { console.log('🟥 Data Base Pushing Error!', error); this.status = 'offline', this.emit('CHANGE') }
  }

  async #createServerModel() {
    return this.Server = await createServerModel(this.sequelize);
  }

  async #createUserModel() {
    return this.User = await createUserModel(this.sequelize);
  }

  async #createCurrentPlaybackModel() {
    return this.CurrentPlayback = await createCurrentPlayback(this.sequelize);
  }

  async #createServerQueueModel() {
    return this.ServerQueue = await createServerQueue(this.sequelize);
  }

  getData(model, mode, options) {
    try {
      if (options && mode == 'getUserList') {
        if (model) return (model.findAll({ where: { UserServerId: options } }));
        else this.createConnection().then(() => { this.getData(model, mode, options) });
      } else if(mode == 'getServerList'){
        if (model) return (model.findAll());
        else this.createConnection().then(() => { this.getData(model, mode, options) });
      } else if(options && mode == 'getCurrentPlayback'){
        if (model) return (model.findAll({ where: { ServerId: options } }));
        else this.createConnection().then(() => { this.getData(model, mode, options) });
      } else if(options && mode == 'getServerQueueFromDB'){
        if (model) return (model.findAll({ where: { ServerId: options } }));
        else this.createConnection().then(() => { this.getData(model, mode, options) });
    }
    } catch (error) { console.log('🟥 Data Base Selection Error!') }
  }

  async updateServerData() {
    try {
      getServerData(this.Server,this.client).then((data)=>this.#pushDataToModel(this.Server,data))
    } catch (error) { console.log('🟥 Data Base Update Error!', error) }
  }

  async updateUserData() {
    try {
     getUserData(this.User,this.client).then((data)=>this.#pushDataToModel(this.User,data))
    } catch (error) { console.log('🟥 Data Base Update Error!', error) }
  }

  async updateServerQueueData() {
    try {
      getServerQueueData(this.ServerQueue,this.client).then((data)=>this.#pushDataToModel(this.ServerQueue,data))
    } catch (error) { console.log('🟥 Data Base Update Error!', error) }
  }

  async updateCurrentPlaybackData() {
    try {
      getCurrentPlaybackData(this.CurrentPlayback,this.client).then((data)=>this.#pushDataToModel(this.CurrentPlayback,data))
    } catch (error) { console.log('🟥 Data Base Update Error!', error) }
  }
}
exports.DataBase = DataBase;