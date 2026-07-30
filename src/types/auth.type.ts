import { Request } from "express";
import { IUserSchema } from "./user.type.js";

export interface IauthenticatedRequest extends Request {
  cookies: {
    accessToken: string;
  };
  user: IUserSchema;
}
