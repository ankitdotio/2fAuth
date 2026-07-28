import { CookieOptions } from "express";
import {
  generateDayMilliseconds,
  generateMinutesMilliseconds,
} from "./date-time.helper.js";
import { config } from "../config/env.js";

type TCookieParam =
  | {
      purpose: "auth";
      type: "minutes" | "day";
      value: number;
    }
  | {
      purpose: "logout";
    };

export const getCookieOptions = (param: TCookieParam) => {
  const cookieOptions: CookieOptions = {
    path: "/v1",
    httpOnly: true,
  };
  if (param.purpose === "auth") {
    let maxAge = 0;
    switch (param.type) {
      case "day": {
        maxAge = generateDayMilliseconds(param.value);
        break;
      }

      case "minutes": {
        maxAge = generateMinutesMilliseconds(param.value);
        break;
      }
    }
    cookieOptions.maxAge = maxAge;
  }

  if (config.NODE_ENV == "production") {
    cookieOptions.sameSite = "strict";
    cookieOptions.httpOnly = true;
    cookieOptions.secure = true;
  }
  return cookieOptions;
};
