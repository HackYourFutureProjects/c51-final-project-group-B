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

/**
 * Initialize the Socket.IO server instance.
 *
 * It accepts one parameter which is the HTTP server.
 *
 * The initServer will attach this HTTP server instance to
 * Socket.IO which  allows both Socket.IO and HTTP server
 * to share same PORT.
 *
 * Please check the comments I put in index.js around 37
 *
 * Then it configs cors to allow connection from FE-React
 *
 * Also connection to this server can only happen if
 * credentials is true that means a user should login
 */
export function initSocket(server) {
  io = new Server(server, { cors: { origin: "*" } });
}

export function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
}
