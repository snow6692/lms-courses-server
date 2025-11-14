import express, { NextFunction, Request, Response } from "express";

import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { NotFoundError } from "./utils/ErrorHandler";

dotenv.config();
export const app = express();
//body parser
app.use(express.json({ limit: "50mb" }));
//Cookie parser
app.use(cookieParser());
//cors cross origin resource sharing
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// testing aoi

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API Is working",
  });
});

//Unknown routes

app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found `, 404);

  next(error);
});
