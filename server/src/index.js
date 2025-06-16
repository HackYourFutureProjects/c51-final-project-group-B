// Load our .env variables
import http from "http";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

import app from "./app.js";
import { logInfo, logError } from "./util/logging.js";
import connectDB from "./db/connectDB.js";
import testRouter from "./testRouter.js";
import { getIo, initSocket } from "./socket.js";
import initChatSocket from "./sockets/chat.js";
import { notificationSocketSpace } from "./sockets/notification.js";

// The environment should set the port
const port = process.env.PORT || 3000;

if (port == null) {
  // If this fails, make sure you have created a `.env` file in the right place with the PORT set
  logError(new Error("Cannot find a PORT number, did you create a .env file?"));
}

/**
 * I have commented out the above startServer code
 *
 * Because: It creates express server a and starts listening directly on a port.
 * It will not be possible to attach a SocketIO to this app.listen(),
 * because app.listen() returns a wrapped server that we do not have control
 * over the underlying http.Server, that means we cannot attach the Socket.IO
 * to the server returned by app.listen.
 */

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    initSocket(server);

    const io = getIo();

    initChatSocket(io);
    notificationSocketSpace(io);

    server.listen(port, () => {
      logInfo(`Server started on port ${port}`);
    });
  } catch (error) {
    logError(error);
  }
};

/****** Host our client code for Heroku *****/
/**
 * We only want to host our client code when in production mode as we then want to use the production build that is built in the dist folder.
 * When not in production, don't host the files, but the development version of the app can connect to the backend itself.
 */
if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(new URL("../../client/dist", import.meta.url).pathname),
  );
  // Redirect * requests to give the client data
  app.get("/*file", (req, res) =>
    res.sendFile(
      new URL("../../client/dist/index.html", import.meta.url).pathname,
    ),
  );
}

/****** For cypress we want to provide an endpoint to seed our data ******/
if (process.env.NODE_ENV !== "production") {
  app.use("/api/test", testRouter);
}

// Start the server
startServer();
