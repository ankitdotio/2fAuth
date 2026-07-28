import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type {
  IUserController,
  IUserRepository,
  IUserRequestData,
  IUserService,
} from "../interfaces/user.interface.js";
import {
  loginUserValidator,
  registerUserValidator,
} from "../validator/user.validator.js";
import { getCookieOptions } from "../helpers/cookie.helper.js";

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
  login: RequestHandler = async (req, res, next) => {
    const body = req.body as IUserRequestData["login"]["body"];

    const { success, data, error } = loginUserValidator.safeParse(body);

    if (!success) {
      next(error);
      return;
    }

    const response = await this.UserService.login(data);
    const cookieOptions = getCookieOptions({
      purpose: "auth",
      type: "minutes",
      value: 5,
    });

    res.cookie("accessToken", response.data.accessToken, cookieOptions);
    res.status(200).json(response);
  };
}
