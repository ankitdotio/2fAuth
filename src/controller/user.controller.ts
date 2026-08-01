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
  recover2FAValidator,
  registerUserValidator,
  verify2FAValidator,
} from "../validator/user.validator.js";
import { getCookieOptions } from "../helpers/cookie.helper.js";
import { IauthenticatedRequest } from "../types/auth.type.js";

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
  activate2FA: RequestHandler = async (req, res, next) => {
    const { user } = req as IauthenticatedRequest;

    const response = await this.UserService.activate2FA(user);

    res.status(200).json(response);
  };

  recover2FA: RequestHandler = async (req, res, next) => {
    const { user } = req as IauthenticatedRequest;
    const body = req.body as IUserRequestData["recover2FA"]["body"];

    const { success, data, error } = recover2FAValidator.safeParse(body);

    if (!success) {
      next(error);
      return;
    }

    const response = await this.UserService.recover2FA(user, data);
    const cookieOptions = getCookieOptions({
      purpose: "auth",
      type: "day",
      value: 1,
    });

    //set cookie

    res.cookie("accessToken", response.data.accessToken, cookieOptions);
    res.status(200).json(response);
  };
  me: RequestHandler = (req, res, next) => {
    const { user } = req as IauthenticatedRequest;
    const response = this.UserService.me(user);
    res.status(200).json(response);
  };

  verify2FA: RequestHandler = async (req, res, next) => {
    const { user } = req as IauthenticatedRequest;
    const body = req.body as IUserRequestData["login"]["body"];

    const { success, data, error } = verify2FAValidator.safeParse(body);

    if (!success) {
      next(error);
      return;
    }

    const response = await this.UserService.verify2FA(user, data);
    const cookieOptions = getCookieOptions({
      purpose: "auth",
      type: "day",
      value: 1,
    });

    res.cookie("accessToken", response.data.accessToken, cookieOptions);
    res.status(200).json(response);
  };
  me: RequestHandler = (req, res, next) => {
    const { user } = req as IauthenticatedRequest;
    const response = this.UserService.me(user);
    res.status(200).json(response);
  };

  logout: RequestHandler = (req, res) => {
    const { user, cookies } = req as IauthenticatedRequest;

    const response = this.UserService.logout(user);

    //COOKIE
    const cookieOptions = getCookieOptions({
      purpose: "logout",
    });

    for (const cookie of Object.keys(cookies)) {
      res.clearCookie(cookie, cookieOptions);
    }
    res.status(200).json(response);
  };
}
