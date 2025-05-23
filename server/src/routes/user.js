import express from "express";
import {
  validateRegistration,
  validateLogin,
} from "../middlewares/validateInput.js";
import { login, register, logout } from "../controllers/user.js";

// ----- In this route we do the users auth actions, register, login and logout (the rest will be in profile route)

const userRouter = express.Router();
// Using the validators middlewares to ensure clean data
userRouter.post("/register", validateRegistration, register);
userRouter.post("/login", validateLogin, login);
userRouter.post("/logout", logout);

export default userRouter;
