import User from "../auth/user.model";
import type { UpdateUser } from "./user.validation";

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select(
    "-password -verificationCode -codeExpiredAt",
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateMe = async (userId: string, payload: UpdateUser) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { ...payload },
    { new: true, runValidators: true },
  ).select("-password -verificationCode -codeExpiredAt");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const deleteMe = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return { message: "Account deleted successfully" };
};

// Admin routes
const getAllUsers = async () => {
  const users = await User.find().select(
    "-password -verificationCode -codeExpiredAt",
  );
  return users;
};

const getUserById = async (id: string) => {
  const user = await User.findById(id).select(
    "-password -verificationCode -codeExpiredAt",
  );

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const deleteUserById = async (id: string) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new Error("User not found");
  }

  return { message: "User deleted successfully" };
};

export const UserService = {
  getMe,
  updateMe,
  deleteMe,
  getAllUsers,
  getUserById,
  deleteUserById,
};
