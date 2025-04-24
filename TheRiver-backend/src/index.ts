import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message as unknown as string); // Since websocket only communicate with strings and binaries, therefore we need to convert the string into an object to perform object oriented functionalities using JSON.parse()
    if (parsedMessage.type === "join") {
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
      });
    }

    if (parsedMessage.type === "chat") {
      // const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room || null;
      let currentUserRoom = null;
      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i].socket == socket) {
          currentUserRoom = allSockets[i].room;
        }
      }

      for (let i = 0; i < allSockets.length; i++){
        if(allSockets[i].room == currentUserRoom){
            allSockets[i].socket.send(parsedMessage.payload.message)
        }
      }
    }
  });
});
