import { string } from "zod";
import { hashValue } from "../helpers/encryption.helper.js";
import { ApplicationException } from "../helpers/errorhelper.js";
import { serviceSuccess } from "../helpers/service.helper.js";
import {
  IUserRepository,
  IUserRequestData,
  IUserService,
} from "../interfaces/user.interface.js";
import { TServiceSuccess } from "../types/service.type.js";

export default class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}
  register = async (payload: IUserRequestData["register"]["body"]) => {
    //finding existing user
    const user = await this.userRepository.findOne({
      email: payload.email,
    });
    if (user) {
      throw new ApplicationException(400, "USER ALREADY EXISTS");
    }
    //hashing password
    const hashedPassword = await hashValue(payload.password);

    //register user
    const newUser = await this.userRepository.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      twoFactorAuth: {
        activated: false,
        secret: null,
        recoveryCodes: [],
      },
    });
    return serviceSuccess("USER REGISTERED", { userId: String(newUser._id) });
  };
}
