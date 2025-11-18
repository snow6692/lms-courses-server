import { Router } from "express";
import {
  registrationUser,
  activateUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { requiredUser } from "../middlewares/auth.js";
const userRouter = Router();

userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", requiredUser, logoutUser);

export default userRouter;
