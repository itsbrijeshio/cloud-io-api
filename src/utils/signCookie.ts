import { Response } from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

const oneDay = 1000 * 60 * 60 * 24;

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as string;
const COOKIE_NAME = process.env.COOKIE_NAME as string;

const signCookie = (res: Response, secret: ObjectId, options?: any): string => {
  // create token
  const token = jwt.sign({ _id: secret }, JWT_SECRET, {
    expiresIn: parseInt(JWT_EXPIRES_IN) * oneDay || oneDay * 7,
  });

  // cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    expiresIn: parseInt(JWT_EXPIRES_IN) * oneDay || oneDay * 7,
    ...options,
  };

  // set cookie
  res.cookie(COOKIE_NAME, token, cookieOptions);
  return token;
};

export default signCookie;
