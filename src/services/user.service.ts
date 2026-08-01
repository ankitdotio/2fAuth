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
import {
  generateDaySeconds,
  generateMinutesSeconds,
} from "../helpers/date-time.helper.js";
import { generateRecoveryCodes, generateTOTP } from "../helpers/2fa.helper.js";
import { createQRCodeDataUrl } from "../helpers/qr.helper.js";

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

  activate2FA = async (user: IUserRequestData["request2FA"]["user"]) => {
    const is2FAactivated = user.twoFactorAuth.activated;
    if (is2FAactivated) {
      throw new ApplicationException(400, "ALREADY ACTIVATED");
    }

    //TOTP
    const totp = generateTOTP(user.email);
    const otpAuth = totp.toString();

    const qrDataUrl = await createQRCodeDataUrl(otpAuth);

    //Properties
    const secret = totp.secret.base32;
    const recoveryCodes = await generateRecoveryCodes(10);

    //Update User
    const updatedUser = await this.userRepository.updateOne(
      { _id: user._id },
      {
        $set: {
          "twoFactorAuth.secret": secret,
          "twoFactorAuth.recoveryCodes": recoveryCodes.hashed.map((code) => {
            return { code, used: false };
          }),
        },
      },
    );
    if (updatedUser.modifiedCount === 0) {
      throw new ApplicationException(400, "ACTIVATION FAILED");
    }

    return serviceSuccess("ACTVATION LOADED", {
      qrDataUrl,
      recoveryCodes: recoveryCodes.plainText,
    });
  };

  verify2FA = async (
    user: IUserRequestData["verify2FA"]["user"],
    payload: IUserRequestData["verify2FA"]["body"],
  ) => {
    const totp = generateTOTP(user.email, user.twoFactorAuth.secret!);
    const delta = totp.validate({
      token: payload.totp,
      window: 1,
    });

    if (delta !== 0) {
      throw new ApplicationException(400, "VERIFICATION FAILED");
    }

    const is2FAActivated = user.twoFactorAuth.activated;

    if (!is2FAActivated) {
      const updatedUser = await this.userRepository.updateOne(
        { _id: user._id },
        {
          $set: {
            "twoFactorAuth.activated": true,
          },
        },
      );
      if (updatedUser.modifiedCount === 0) {
        throw new ApplicationException(400, "VERIFICATION FAILED");
      }
    }

    //token generation
    const tokenPayload: TJwtPayload = {
      userId: String(user._id),
      stage: "2fa",
    };

    const accessToken = signJWT(
      tokenPayload,
      config.ACCESS_TOKEN_SECRET,
      generateDaySeconds(1),
    );
    return serviceSuccess("LOGGED IN", {
      userId: String(user._id),
      accessToken,
    });
  };

  me = (user: IUserRequestData["me"]["user"]) => {
    const sanitizedUser = {
      userId: String(user._id),
      name: user.name,
      email: user.email,
      twoFactorAuth: { activated: user.twoFactorAuth.activated },
      createdAt: user.createdAt,
    };
    return serviceSuccess("USER FETCHED", sanitizedUser);
  };

  logout = (user: IUserRequestData["logout"]["user"]) => {
    return serviceSuccess("LOGOUT SUCCESSFULLY", {
      userId: String(user._id),
    });
  };
}
