import express from "express";
import {
  validateRegistration,
  validateLogin,
} from "../middlewares/validateInput.js";
import { login, register, logout, deleteAccount } from "../controllers/user.js";
import authMiddleware from "../middlewares/authMiddleware.js";
// ----- In this route we do the users auth actions, register, login and logout (the rest will be in profile route)

const userRouter = express.Router();
// Using the validators middlewares to ensure clean data
userRouter.post("/signup", validateRegistration, register);
userRouter.post("/signin", validateLogin, login);

userRouter.post("/register", validateRegistration, register);
userRouter.post("/login", validateLogin, login);
userRouter.post("/logout", logout);
userRouter.post("/delete", authMiddleware, deleteAccount);

export default userRouter;
