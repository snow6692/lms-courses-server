import { Response } from "express";
import { IUser } from "../models/user.model.js";
import { redis } from "./redis.js";
import { ENV } from "./env.js";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

export const sendToken = async (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();
  const accessTokenExpire = ENV.ACCESS_TOKEN_EXPIRE;
  const refreshTokenExpire = ENV.REFRESH_TOKEN_EXPIRE;

  //upload session to redis
  const userId = user._id.toString();
  const userObj = user.toObject();
  delete userObj.password;
  await redis.set(userId, JSON.stringify(userObj), "EX", refreshTokenExpire);

  // OPTIONS FOR COOKIES
  const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };
  const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  // set secure in production
  if (ENV.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
  }
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user: userObj,
  });
};
