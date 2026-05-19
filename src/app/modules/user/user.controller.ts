import type { Request, Response } from "express";
import { UserService } from "./user.service";
import { ApiResponse } from "../../utils/ApiResponse";
import catchAsync from "../../utils/carchAsync";

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await UserService.getMe(userId);
  ApiResponse.success(res, "User retrieved successfully", result);
});

const updateMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await UserService.updateMe(userId, req.body);
  ApiResponse.success(res, "User updated successfully", result);
});

const deleteMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await UserService.deleteMe(userId);
  ApiResponse.success(res, "Account deleted successfully", result);
});

// Admin controllers
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  ApiResponse.success(res, "Users retrieved successfully", result);
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserById(req.params.id);
  ApiResponse.success(res, "User retrieved successfully", result);
});

const deleteUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deleteUserById(req.params.id);
  ApiResponse.success(res, "User deleted successfully", result);
});

export const UserController = {
  getMe,
  updateMe,
  deleteMe,
  getAllUsers,
  getUserById,
  deleteUserById,
};
