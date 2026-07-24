import type { Application, NextFunction, Request, Response } from "express";
import express from "express";
import globalErrorMiddleware from "./middlewares/globalErrorMiddleware.js";
import { ApplicationException } from "./helpers/errorhelper.js";

export const app: Application = express();

app.use(express.json());

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
