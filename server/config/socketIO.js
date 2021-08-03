var client = require('socket.io')(http);

client.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */

    console.log('new client connected - blah blah blah');
    socket.emit('connection', null);
});

class SocketIO {
    users = [];
    connection(client) {
        client.on("disconnect", () => {
            this.users = this.users.filter((user) => user.socketId !== client.id);
        })
    }
}

module.exports = io;