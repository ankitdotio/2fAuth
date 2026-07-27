import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type {
  IUserController,
  IUserRepository,
  IUserRequestData,
  IUserService,
} from "../interfaces/user.interface.js";
import { registerUserValidator } from "../validator/user.validator.js";

export default class UserController implements IUserController {
  constructor(private UserService: IUserService) {}

  register: RequestHandler = async (req, res, next) => {
    const body = req.body as IUserRequestData["register"]["body"];

    const { success, data, error } = registerUserValidator.safeParse(body);

    if (!success) {
      next(error);
      return;
    }

    const response = await this.UserService.register(data);

    res.status(201).json(response);
  };
}
