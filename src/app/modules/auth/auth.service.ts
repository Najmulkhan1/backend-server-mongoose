import User from "./user.model";
import type { UserLogin, UserRetisger, UserVerifyEmail } from "./auth.validation";
import { sendVerificationEmail } from "../../utils/sendEmail";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../../../config/env";

const login = async (payload: UserLogin) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isVerified) {
    throw new Error("Email is not verified");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const jwtPayload = {
    userId: user._id,
    email: user.email,
  };

  const accessToken = jwt.sign(jwtPayload, env.JWT_ACCESS_SECRET, {
    expiresIn: "1d",
  });

  const { password, verificationCode, codeExpiredAt, ...userObj } = user.toObject();

  return {
    user: userObj,
    accessToken,
  };
};

const register = async (payload: UserRetisger) => {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  const codeExpiredAt = new Date(Date.now() + 15 * 60 * 1000);

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    age: payload.age,
    verificationCode: verificationCode,
    codeExpiredAt: codeExpiredAt,
  });

  try {
    await sendVerificationEmail(user.email, verificationCode);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }

  const { password, verificationCode: _, codeExpiredAt: __, ...userWithoutSecrets } = user.toObject();

  return userWithoutSecrets;
};

const verifyEmail = async (payload: UserVerifyEmail) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email is already verified");
  }

  if (!user.verificationCode || user.verificationCode !== payload.code) {
    throw new Error("Invalid verification code");
  }

  const currentTime = new Date();
  if (user.codeExpiredAt && currentTime > user.codeExpiredAt) {
    throw new Error("Verification code has expired");
  }

  const updatedUser = await User.findOneAndUpdate(
    { email: payload.email },
    {
      isVerified: true,
      verificationCode: null,
      codeExpiredAt: null,
    },
    { new: true },
  );

  return {
    message: "Email verified successfully",
    userId: updatedUser?._id,
  };
};

const changePassword = async (payload: string) => {
  return payload;
};

const forgotPassword = async (payload: string) => {
  return payload;
};

const getAllUsers = async () => {
  const allUsers = await User.find();
  return allUsers;
};

export const Authservice = {
  login,
  register,
  changePassword,
  forgotPassword,
  getAllUsers,
  verifyEmail,
};
