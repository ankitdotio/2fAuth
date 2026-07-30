import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import globalErrorMiddleware from "./middlewares/globalErrorMiddleware.js";
import { ApplicationException } from "./helpers/errorhelper.js";
import userRouter from "./routes/user.router.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";

export const app: Application = express();

app.use(express.json());

app.use(helmet());
app.use(cookieParser());

/**
 * ROUTER
 */

app.use("/v1/user", userRouter);

/**
 * 404 ERROR HANDLER
 */
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApplicationException(404, "ROUTE NOT FOUND"));
});

/**
 * Global Error Middleware
 */
app.use(globalErrorMiddleware);
