const { DataTypes } = require('sequelize');
exports.createServerQueue = async function createModel(sequelize) {
    let ServerQueue = sequelize.define(
        'ServerQueue',
        {
            Id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            ServerId: {
                type: DataTypes.CHAR,
                allowNull: false,
            },
            SongName: {
                type: DataTypes.CHAR,
                allowNull: true,
            },
            SongUrl: {
                type: DataTypes.CHAR,
                allowNull: true,
            }
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
        }
    )
    ServerQueue.rawAttributes
    return await ServerQueue;
}

exports.getServerQueueData = async function updateData(ServerQueue, client) {
    const promise = new Promise((resolve, reject) => {
        try {
            let array = [];
            let pushDelay;
            let object;
            let tempQueue;
            ServerQueue.sync({ force: true }).then(async () => {
                client.guilds.cache.forEach(async guild => {
                    clearTimeout(pushDelay);
                    tempQueue = (client.queue.get(guild.id));
                    if (tempQueue && tempQueue.songs !== []) {
                        tempQueue.songs.forEach((song) => {
                            object = {
                                ServerId: guild.id,
                                SongName: song.title,
                                SongUrl: song.url
                            }
                            array.push(object);
                        })
                    } else {
                        object = {
                            ServerId: guild.id
                        }
                        array.push(object);
                    }
                    pushDelay = setTimeout(() => { resolve(array) }, 1000);
                })
            })
        } catch (error) { console.log('🟥 Data Base Update Error!', error) }
    })
    return promise;

}
