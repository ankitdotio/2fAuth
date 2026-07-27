import express from "express";
import UserRepository from "../repositories/user.repository.js";
import UserService from "../services/user.service.js";
import UserController from "../controller/user.controller.js";

const userRouter = express.Router();

//REPOSITORY
const userRepository = new UserRepository();

//SERVICE
const userService = new UserService(userRepository);

//CONTROLLER
const userController = new UserController(userService);

userRouter.route("/register").post(userController.register);

export default userRouter;
