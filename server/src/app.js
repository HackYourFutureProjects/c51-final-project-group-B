import express from "express";
import cookieParser from "cookie-parser";
import profileRouter from "./routes/profile.js";
import userRouter from "./routes/user.js";
import jobRouter from "./routes/jobPosts.js";
import authRouter from "./routes/auths.js";
import applicationsRouter from "./routes/applications.js";
import messagesRouter from "./routes/messages.js";
import savedJobsRouter from "./routes/savedJobs.js";
import { logError } from "./util/logging.js";
import feedRouter from "./routes/feed.js";

// Create an express server
const app = express();
// Tell express to use cookieParser
app.use(cookieParser());

// Tell express to use the json middleware
app.use(express.json());

/****** Attach routes ******/
/**
 * We use /api/ at the start of every route!
 * As we also host our client code on heroku we want to separate the API endpoints.
 */
app.use("/api/users", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/auth", authRouter);

app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/messages", messagesRouter);

app.use("/api/feed", feedRouter);

app.use("/api/saved-jobs", savedJobsRouter);

/**
 * There is a good guide on writing error handler.
 * Check this link:
 *
 * https://expressjs.com/en/guide/error-handling.html
 *
 *  */
function errorHandler(err, _req, res, _next) {
  logError(err);
  res
    .status(500)
    .json({ success: false, msg: "Something went wrong on the server." });
}

app.use(errorHandler);

export default app;
