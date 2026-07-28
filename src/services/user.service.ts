import { string } from "zod";
import { compareValue, hashValue } from "../helpers/encryption.helper.js";
import { ApplicationException } from "../helpers/errorhelper.js";
import { serviceSuccess } from "../helpers/service.helper.js";
import {
  IUserRepository,
  IUserRequestData,
  IUserService,
} from "../interfaces/user.interface.js";
import { TServiceSuccess } from "../types/service.type.js";
import { TJwtPayload } from "../types/jwt.type.js";
import { signJWT } from "../helpers/jwt.helper.js";
import { config } from "../config/env.js";
import { generateMinutesSeconds } from "../helpers/date-time.helper.js";

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

  login = async (payload: IUserRequestData["login"]["body"]) => {
    //FINDING USER
    const user = await this.userRepository.findOne(
      {
        email: payload.email,
      },
      "+password",
    );

    if (!user) {
      throw new ApplicationException(400, "INVALID CREDENTIALS");
    }

    //PASSWORD
    const enteredPassword = payload.password;
    const hashedPassword = user.password;

    const isValidPassword = compareValue(enteredPassword, hashedPassword);

    if (!isValidPassword) {
      throw new ApplicationException(400, "INVALID CREDENTIALS");
    }

    //TOKEN PAYLOAD

    const tokenPayload: TJwtPayload = {
      userId: String(user._id),
      stage: "password",
    };

    const accessToken = signJWT(
      tokenPayload,
      config.ACCESS_TOKEN_SECRET,
      generateMinutesSeconds(5),
    );
    return serviceSuccess("LOGGED IN", {
      userId: String(user._id),
      accessToken,
    });
  };
}
