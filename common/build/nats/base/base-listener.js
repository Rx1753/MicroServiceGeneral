"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
class Listener {
    constructor(client) {
        this.ackWait = 5 * 1000; // 5 sec
        this.client = client;
    }
    subcriptionOptions() {
        return this.client
            .subscriptionOptions() //subscriptionOptions
            .setDeliverAllAvailable() // very first time our subscription is created we get all messgaes on channel that emited
            .setManualAckMode(true) // it returun if we do not ackknowledge
            .setAckWait(this.ackWait) // time that waiting for acknowledgement
            .setDurableName(this.queueGroupName); // return that event that might be missed by that listener
    }
    listen() {
        const subcription = this.client.subscribe(this.subject, this.queueGroupName, this.subcriptionOptions());
        subcription.on('message', (msg) => {
            console.log(`message recived  ${this.subject} on ${this.queueGroupName}`);
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }
    parseMessage(msg) {
        const data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf-8')); //utf-8 for buffer
    }
}
exports.Listener = Listener;
