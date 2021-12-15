const { DataTypes } = require('sequelize');
exports.createUserModel = async function createModel(sequelize) {
  let User
  User = sequelize.define(
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
  User.rawAttributes
  return await User;
}

exports.getUserData = async function updateUserDataTable(User, client) {
  const promise = new Promise((resolve, reject) => {
    try {
      let array = [];
      let pushDelay;
      User.sync({ force: true }).then(async () => {
        client.guilds.cache.forEach(async guild => {
          await guild.members.fetch().then(async (list) => {
            await list.forEach(async (user) => {
              clearTimeout(pushDelay);
              let object = {
                UserName: user.user.username,
                UserId: user.user.id,
                UserServerId: user.guild.id,
              }
              array.push(object);
              pushDelay = setTimeout(() => { resolve(array) }, 1000);
            })
          })
        })
      })
    } catch (error) { console.log('🟥 Data Base Update Error!', error) }
  })
  return promise
}
