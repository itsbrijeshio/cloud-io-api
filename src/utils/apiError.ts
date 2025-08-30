import { ErrorFormat, HTTPCode, HTTPStatus } from "../types";

class ApiError<T> extends Error {
  public statusCode: HTTPStatus;
  public code: HTTPCode;
  public details?: T;

  constructor(err: ErrorFormat<T>) {
    super(err.message);
    this.statusCode = err.statusCode;
    this.code = err.code;
    this.details = err.details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
