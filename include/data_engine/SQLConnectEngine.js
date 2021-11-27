const { Sequelize, DataTypes } = require('sequelize');
const EventEmitter = require('events');
const emitter = new EventEmitter;
class DataBase extends EventEmitter {
  constructor(client) {
    super();
    this.client = client;
  }

  async createConnection(option) {
    try {
      this.sequelize = new Sequelize("DiscordBotDataBase", "Admin", "Sengordei#1", {
        dialect: "mssql",
        host: "GORDEYPC",
        logging: false,
      });
      await this.sequelize
        .authenticate()
        .then(() => { console.log('⬜ Data Base Connection Is Enable'); this.status = 'online'; })
        .catch(error => { console.error('🟥 Unable to connect to the database:', error); this.status = 'offline' })
      this.#createServerModel();
      this.#createUserModel();
      this.updateServerData();
      this.updateUserData();
    } catch (error) { console.log('🟥 Data Base Connection Error!'); this.status = 'offline', this.emit('CHANGE') }
  }

  #pushDataToModel(model, data) {
    try {
      model.bulkCreate(data);
    } catch (error) { console.log('🟥 Data Base Pushing Error!'); this.status = 'offline', this.emit('CHANGE') }
  }

  #createServerModel() {
    this.Server = this.sequelize.define(
      'Server',
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        ServerName: {
          type: DataTypes.CHAR,
          allowNull: false,
        },
        ServerId: {
          type: DataTypes.CHAR,
          allowNull: false,
        },
        MemberCount: {
          type: DataTypes.CHAR,
          allowNull: false,
        },
      },
      {
        timestamps: false,
        createdAt: false,
        updatedAt: false,

      }
    )
    this.Server.rawAttributes
  }

  #createUserModel() {
    this.User = this.sequelize.define(
      'User',
      {
        Id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        UserName: {
          type: DataTypes.CHAR,
          allowNull: false,
        },
        UserId: {
          type: DataTypes.CHAR,
          allowNull: false,
        },
        UserServerId: {
          type: DataTypes.CHAR,
          allowNull: false,
        },
      },
      {
        timestamps: false,
        createdAt: false,
        updatedAt: false,

      }
    )
  }

  getData(model, options) {
    try {
      if (options) {
        if (model) return (model.findAll({ where: { UserServerId: options } }));
        else this.connect().then(() => { this.getData(model) });
      } else {
        if (model) return (model.findAll());
        else this.connect().then(() => { this.getData(model) });
      }
    } catch (error) { console.log('🟥 Data Base Selection Error!') }
  }

  updateServerData() {
    try {
      let array = [];
      let pushDelay;
      this.Server.sync({ force: true }).then(async () => {
        this.client.guilds.cache.forEach(async element => {
          clearTimeout(pushDelay);
          let object = {
            ServerName: element.name,
            ServerId: element.id,
            MemberCount: element.memberCount
          }
          array.push(object);
          pushDelay = setTimeout(() => this.#pushDataToModel(this.Server, array), 1000);
        })
      })
    } catch (error) { console.log('🟥 Data Base Update Error!') }
  }

  async updateUserData() {
    try {
      let array = [];
      let pushDelay;
      this.User.sync({ force: true }).then(async () => {
        this.client.guilds.cache.forEach(async guild => {
          await guild.members.fetch().then(async (list) => {
            await list.forEach(async (user) => {
              clearTimeout(pushDelay);
              let object = {
                UserName: user.user.username,
                UserId: user.user.id,
                UserServerId: user.guild.id,
              }
              array.push(object);
              pushDelay = setTimeout(() => this.#pushDataToModel(this.User, array), 1000);
            })
          })
        })
      })
    } catch (error) { console.log('🟥 Data Base Update Error!') }
  }
}
exports.DataBase = DataBase;