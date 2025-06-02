import express from "express";
import { createApplication } from "../controllers/applications.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const applicationsRouter = express.Router();

applicationsRouter.post("/", authMiddleware, createApplication);

export default applicationsRouter;
