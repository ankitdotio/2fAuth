import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { config } from "../config/env.js";
import { ApplicationException } from "../helpers/errorhelper.js";
import { ZodError } from "zod";

type TGlobalError = Error | ApplicationException | ZodError;

const globalErrorMiddleware: ErrorRequestHandler = (
  err: TGlobalError,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let errorMessage = err.message;
  if (err instanceof ApplicationException) {
    statusCode = err.statusCode;
  } else if (err instanceof ZodError) {
    if (err.issues.length > 0) {
      const { path, message } = err.issues[0];
      statusCode = 422;
      errorMessage = `${path.length > 0 ? path + " -> " : ""}${message}`;
    }
  }
  const response = {
    success: false,
    message: errorMessage || "OOPS SOMETHING IS NOT RIGHT",
  };

  console.dir(
    {
      ...res,
      stack: err.stack,
      environment: config.NODE_ENV,
    },
    {
      depth: null,
      colors: true,
    },
  );

  res.status(statusCode).json(response);
};

export default globalErrorMiddleware;
