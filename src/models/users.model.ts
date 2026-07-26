import mongoose from "mongoose";
import type { IUserSchema, TTwoFactorAuth } from "../types/user.type.js";
import { required } from "zod/mini";

const twoFactorAuthRecoverySchema = new mongoose.Schema<
  IUserSchema["twoFactorAuth"]["recoveryCodes"][0]
>(
  {
    code: {
      type: String,
      required: true,
    },
    used: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    _id: false,
  },
);

const twoFactorAuthSchema = new mongoose.Schema<TTwoFactorAuth>(
  {
    activated: {
      type: Boolean,
      required: true,
      default: true,
    },
    recoveryCodes: {
      type: [twoFactorAuthRecoverySchema],
      required: true,
      select: false,
      default: [],
    },
    secret: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    _id: false,
  },
);
const userSchema = new mongoose.Schema<IUserSchema>(
  {
    name: {
      type: String,
      required: [true, "NAME IS A REQURIRED FIELD"],
    },
    email: {
      type: String,
      required: [true, "EMAIL IS A REQURIRED FIELD"],
    },
    password: {
      type: String,
      required: [true, "PASSWORD IS A REQURIRED FIELD"],
    },
    twoFactorAuth: {
      type: twoFactorAuthSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const userModel = mongoose.model("user", userSchema);
