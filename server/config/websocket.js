// const WebSocket = require("ws");

// const client = new WebSocket.Server({ port: process.env.PORT || 8000 });
// const wss = new WebSocket.Server({ server: "8000" });

class WebSockets {
    users = [];
    connection(client) {
        client.on("disconnect", () => {
            this.users = this.users.filter((user) => user.socketId !== client.id);
        });

        client.on("identity", (userId) => {
            this.users.push({
                socketId: client.id,
                userId: userId,
            });
        });
        client.on("subscribe", (room, otherUserId = "") => {
            this.subscribeOtherUser(room, otherUserId);
            cliet.join(room);
        });
        client.on("unsubscribe", (room) => {
            client.leave(room);
        });
    }

    subscribeOtherUser(room, otherUserId) {
        const userSockets = this.users.filter((user) => user.userId === otherUserId);
        userSockets.map((userInfo) => {
            const socketConn = global.io.sockets.connected(userInfo.socketId);
            if (socketConn) {
                socketConn.join(room);
            }
        });
    }
}

module.exports = WebSockets;