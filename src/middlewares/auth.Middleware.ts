import { RequestHandler } from "express";
import { IUserRepository } from "../interfaces/user.interface.js";
import { IauthenticatedRequest } from "../types/auth.type.js";
import { verifyJWT } from "../helpers/jwt.helper.js";
import { config } from "../config/env.js";
import { TJwtPayload } from "../types/jwt.type.js";
import { userModel } from "../models/users.model.js";
import { ApplicationException } from "../helpers/errorhelper.js";

type TAuthMiddlewareParams = {
  stage: ("password" | "2fa")[];
  repositories: {
    userRepository: IUserRepository;
  };
};

const authMiddleware =
  (param: TAuthMiddlewareParams): RequestHandler =>
  async (_req, res, next) => {
    const req = _req as IauthenticatedRequest;
    const { accessToken } = req.cookies;
    if (accessToken) {
      const jwtPayload = verifyJWT(
        accessToken,
        config.ACCESS_TOKEN_SECRET,
      ) as TJwtPayload;

      let isAuthenticated = false;
      if (param.stage.includes(jwtPayload.stage)) {
        isAuthenticated = true;
      }
      if (isAuthenticated) {
        const user = await param.repositories.userRepository.findOne(
          {
            _id: jwtPayload.userId,
          },
          "+twoFactorAuth.secret +twoFactorAuth.recoveryCodes",
        );
        if (!user) {
          return next(new ApplicationException(401, "UNAUTHORIZED"));
        }
        req.user = user;
        res.setHeader("X-Auth-Stage", jwtPayload.stage);
        return next();
      }
    } else {
      return next(new ApplicationException(401, "NO ACCESS TOKEN"));
    }
    return next(new ApplicationException(401, "UNAUTHORIZED"));
  };
export default authMiddleware;
