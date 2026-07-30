import type { IUserRepository } from "../interfaces/user.interface.js";
import { userModel } from "../models/users.model.js";
import type { IUserSchema } from "../types/user.type.js";
import type { QueryFilter, UpdateQuery, UpdateWriteOpResult } from "mongoose";

export default class UserRepository implements IUserRepository {
  findOne = async (filter: QueryFilter<IUserSchema>, select?: string) => {
    return await userModel.findOne(filter).select(select ?? "");
  };
  create = async (payload: IUserSchema) => {
    return await userModel.create(payload);
  };
  updateOne = async (
    filter: QueryFilter<IUserSchema>,
    update: UpdateQuery<IUserSchema>,
  ) => {
    return await userModel.updateOne(filter, update);
  };
}
