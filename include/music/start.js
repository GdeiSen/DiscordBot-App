const { queueMaster } = require("./queueConstructor.js");
const { songMaster } = require("./play.js");
module.exports.run = async (client,message,args) => {
    const serverQueueConstruct = new queueMaster(client,message);
    serverQueueConstruct.createQueue();

}