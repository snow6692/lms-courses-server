import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import UserModel, { IUser } from "../models/user.model.js";
import { BadRequestError, HttpError } from "../utils/ErrorHandler.js";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import {
  activateUserSchema,
  loginSchema,
  registrationSchema,
  RegistrationType,
} from "../validation/user.zod.js";
import { validateData } from "../validation/validate.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/jwt.js";
//Register

// controllers/user.controller.ts
export const registrationUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("hola");

    const { email, name, password, avatar } = validateData(
      registrationSchema,
      req.body
    );

    const isEmailExists = await UserModel.findOne({ email });
    if (isEmailExists) {
      return next(new BadRequestError("Email Already in used"));
    }

    const user: RegistrationType = { email, name, password };
    const activationToken = createActivationToken(user);
    const { activationCode, token } = activationToken;
    const data = { user: { name }, activationCode };

    await sendMail({
      email,
      subject: "Activate Your Account",
      data,
      template: "activation-mail.ejs",
    });

    res.status(201).json({
      success: true,
      message: `Please check your email: ${email} to activate your account!`,
      activationToken: token,
    });
  }
);
interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (
  user: RegistrationType
): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activationCode };
};

// controllers/user.controller.ts
export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activation_code, activation_token } = validateData(
      activateUserSchema,
      req.body
    );

    const newUser = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET as Secret
    ) as { user: IUser; activationCode: string };

    if (newUser.activationCode !== activation_code) {
      return next(new HttpError("Invalid activation code", 400));
    }

    const { name, email, password } = newUser.user;

    const existsUser = await UserModel.findOne({ email });
    if (existsUser) {
      return next(new HttpError("Email already exists", 400));
    }

    await UserModel.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "Account activated successfully!",
    });
  }
);

// login user

export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = validateData(loginSchema, req.body);
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new HttpError("Invalid email or password", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new HttpError("Invalid email or password", 400));
    }

    await sendToken(user, 200, res);
  }
);

// logout user
export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
);
