const { DataTypes } = require('sequelize');
const EventEmitter = require('events')
let emitter = new EventEmitter();
exports.createServerModel = async function createModel(sequelize) {
  let Server
  Server = sequelize.define(
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
  Server.rawAttributes
  return await Server;
}

exports.getServerData = async function updateServerData(Server, client) {
  const promise = new Promise((resolve, reject) => {
    try {
      let array = [];
      let pushDelay;
      Server.sync({ force: true }).then(async () => {
        client.guilds.cache.forEach(async element => {
          clearTimeout(pushDelay);
          let object = {
            ServerName: element.name,
            ServerId: element.id,
            MemberCount: element.memberCount
          }
          array.push(object);
          pushDelay = setTimeout(() => { resolve(array) }, 1000);
        })
      })
    } catch (error) { console.log('🟥 Data Base Update Error!', error) }
  })
  return promise
}
