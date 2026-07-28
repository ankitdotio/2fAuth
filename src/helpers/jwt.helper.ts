import jwt from "jsonwebtoken";
import { TJwtPayload } from "../types/jwt.type.js";

export const signJWT = (
  payload: TJwtPayload,
  secret: string,
  expiresIn: number,
) => jwt.sign(payload, secret, { expiresIn });
