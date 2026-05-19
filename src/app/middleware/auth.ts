import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import env from "../../config/env";
import status from "http-status";

export interface JwtPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(status.UNAUTHORIZED).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(status.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
