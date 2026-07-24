import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import { config } from "../config/env.js";
import { ApplicationException } from "../helpers/errorhelper.js";

type TGlobalError = Error | ApplicationException;

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
