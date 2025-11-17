import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import { BadRequestError, HttpError } from "../utils/ErrorHandler.js";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import {
  registrationSchema,
  RegistrationType,
} from "../validation/user.zod.js";
import { validateData } from "../validation/validate.js";
import { sendMail } from "../utils/sendMail.js";
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
