import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let userCount = 0;
let allSockets: WebSocket[] = [];

wss.on("connection", (socket) => {
  userCount = userCount + 1;
  allSockets.push(socket);
  console.log("User connected #" + userCount);

  socket.on("message", (message) => {
    console.log(
      `message received from User ${userCount}: ${message.toString()}`
    );
    for (let i = 0; i < allSockets.length; i++) {
      const s = allSockets[i];
      s.send(message.toString() + ": sent from " + userCount);
    }
  });

  socket.on("disconnect", () => {
    allSockets = allSockets.filter(x => x != socket);
  })
});
