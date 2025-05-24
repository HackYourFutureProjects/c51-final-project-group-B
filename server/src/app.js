import express from "express";
import cookieParser from "cookie-parser";
import profileRouter from "./routes/profile.js";
import userRouter from "./routes/user.js";

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

export default app;
