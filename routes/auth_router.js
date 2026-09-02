import express from "express";
import {
  register,
  login,
  removeUser,
  updateUser,
  getAllUsers,
} from "../controllers/auth_controller.js";

const authRouter = express.Router();

authRouter.get("/users", getAllUsers);
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.delete("/users/:id", removeUser);
authRouter.put("/users/:id", updateUser);

export default authRouter;