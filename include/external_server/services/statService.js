exports.StatService = class StatService {

    constructor(connectionManager) {
        this.connectionManager = connectionManager;
    }

    increaseStatsCount(serverId, state, amount) {
        console.log(serverId, state, amount);
        this.connectionManager.post({
            name: 'increaseCountState',
            serverId: serverId,
            state: state,
            date: (new Date).toDateString(),
            amount: amount || 1,
            dispatchTo: "data_queue"
        })
    }
}
