import express from "express";
import UserRepository from "../repositories/user.repository.js";
import UserService from "../services/user.service.js";
import UserController from "../controller/user.controller.js";
import authMiddleware from "../middlewares/auth.Middleware.js";

const userRouter = express.Router();

//REPOSITORY
const userRepository = new UserRepository();

//SERVICE
const userService = new UserService(userRepository);

//CONTROLLER
const userController = new UserController(userService);

userRouter.route("/register").post(userController.register);

//LOGIN ROUTE
userRouter.route("/login").post(userController.login);

userRouter.route("/activate-2fa").post(
  authMiddleware({
    stage: ["password"],
    repositories: { userRepository },
  }),
  userController.activate2FA,
);

userRouter.route("/verify-2fa").post(
  authMiddleware({
    stage: ["password"],
    repositories: { userRepository },
  }),
  userController.verify2FA,
);

userRouter.route("/me").get(
  authMiddleware({
    stage: ["password", "2fa"],
    repositories: { userRepository },
  }),
  userController.me,
);

userRouter.route("/logout").put(
  authMiddleware({
    stage: ["password", "2fa"],
    repositories: { userRepository },
  }),
  userController.logout,
);

export default userRouter;
