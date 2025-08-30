import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils";

const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers?.authorization?.split(" ")[1];
  const token = req.cookies?.[process.env.COOKIE_NAME as string] || authHeader;

  try {
    const decoded: unknown = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );
    req.auth = { _id: (decoded as { _id: string })._id };
    if (!req.auth._id) {
      throw new ApiError({
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "Invalid or expired token.",
      });
    }
    next();
  } catch (error) {
    throw new ApiError({
      statusCode: 401,
      code: "UNAUTHORIZED",
      message: "You are not logged in.",
    });
  }
};

export default authGuard;
