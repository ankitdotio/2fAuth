import type { RequestHandler } from "express";
import type { IUserSchema } from "../types/user.type.js";
import type { QueryFilter, UpdateQuery, UpdateWriteOpResult } from "mongoose";
import type { TServiceSuccess } from "../types/service.type.js";
import type z from "zod";
import type {
  loginUserValidator,
  registerUserValidator,
} from "../validator/user.validator.js";

export interface IUserRepository {
  findOne: (
    filter: QueryFilter<IUserSchema>,
    select?: string,
  ) => Promise<IUserSchema | null>;
  create: (payload: IUserSchema) => Promise<IUserSchema>;
  updateOne: (
    filter: QueryFilter<IUserSchema>,
    update: UpdateQuery<IUserSchema>,
  ) => Promise<UpdateWriteOpResult>;
}

export interface IUserController {
  register: RequestHandler;
  login: RequestHandler;
}

export interface IUserService {
  register: (
    payload: IUserRequestData["register"]["body"],
  ) => Promise<TServiceSuccess<{ userId: string }>>;

  login: (
    payload: IUserRequestData["login"]["body"],
  ) => Promise<TServiceSuccess<{ userId: string; accessToken: string }>>;
}

export interface IUserRequestData {
  register: {
    body: z.infer<typeof registerUserValidator>;
  };
  login: {
    body: z.infer<typeof loginUserValidator>;
  };
}
