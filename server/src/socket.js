import { Server } from "socket.io";

/**
 * In this code the creation of server instance(io) follows
 * the singleton design pattern which means only one
 * Socket.IO server instance called io is created
 * during lifetime the application.
 *
 * This instance can be imported and used
 * anywhere in the code.
 */

let io;

export function initSocket(server) {
  io = new Server(server, { cors: { origin: "*" } });
}

export function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}
