import { Response } from "express";

export type HTTPStatus = 200 | 201 | 400 | 401 | 403 | 404 | 409 | 429 | 500;

export type HTTPCode =
  | "OK"
  | "CREATED"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "TOO_MANY_REQUESTS"
  | "SERVER_ERROR";

export type Message = string;

export interface ErrorFormat<T> {
  statusCode: HTTPStatus;
  code: HTTPCode;
  message: Message;
  details?: T;
}

declare module "express-serve-static-core" {
  interface Request {
    auth: { _id: string };
  }
}
