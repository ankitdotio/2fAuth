import mongoose from "mongoose";
import { config } from "./env.js";
import { ApplicationException } from "../helpers/errorhelper.js";

export const connectDb = async (): Promise<string> => {
  try {
    const { connection } = await mongoose.connect(config.DB_STRING);
    console.log('INSIDE " db.config.ts " DATABASE CONNECTED', connection.name);
    return connection.name;
  } catch (error) {
    throw new ApplicationException(503, "ERROR WHILE CONNECTING TO DB", {
      cause: error,
    });
  }
};
