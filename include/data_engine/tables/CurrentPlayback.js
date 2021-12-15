const { DataTypes } = require('sequelize');
exports.createCurrentPlayback = async function createModel(sequelize) {
    let CurrentPlayback = sequelize.define(
        'CurrentPlayback',
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
            Song: {
                type: DataTypes.CHAR,
                allowNull: true,
            },
            QueueLoop: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            SongLoop: {
                type: DataTypes.CHAR,
                allowNull: true,
            },
            Volume: {
                type: DataTypes.CHAR,
                allowNull: true,
            },
            Thumbnail: {
                type: DataTypes.CHAR,
                allowNull: true,
            },
        },
        {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
        }
    )
    CurrentPlayback.rawAttributes
    return await CurrentPlayback;
}

exports.getCurrentPlaybackData = async function updateData(CurrentPlayback, client) {
    const promise = new Promise((resolve, reject) => {
        try {
            let array = [];
            let pushDelay;
            let object;
            let tempQueue;
            CurrentPlayback.sync({ force: true }).then(async () => {
                client.guilds.cache.forEach(async guild => {
                    clearTimeout(pushDelay);
                    tempQueue = (client.queue.get(guild.id));
                    if (tempQueue && tempQueue.current) {
                        object = {
                            ServerId: guild.id,
                            Song: tempQueue.current.title,
                            QueueLoop: tempQueue.config.loop,
                            SongLoop: tempQueue.current.loop,
                            Volume: tempQueue.config.volume,
                            Thumbnail: tempQueue.current.thumbnail
                        }
                    } else if (!guild.queue) {
                        object = {
                            ServerId: guild.id
                        }
                    }
                    array.push(object);
                    pushDelay = setTimeout(() => { resolve(array) }, 1000);
                })
            })
        } catch (error) { console.log('🟥 Data Base Update Error!', error) }
    })
    return promise;

}
