import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { Schema } from "zod";
import { ApiError } from "../utils";

type source = "body" | "params" | "query";

const validateRequest =
  (schema: Schema, source: source = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    const data = req[source];
    await schema.parseAsync(data);
    next();
  };

const isValidId =
  (source: source = "params", key: string, resource: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    const ID = req?.[source]?.[key];
    if (!Types.ObjectId.isValid(ID)) {
      throw new ApiError({
        statusCode: 400,
        code: "BAD_REQUEST",
        message: `${resource} id is not valid`,
      });
    }
    next();
  };

validateRequest.isValid = isValidId;

export default validateRequest;
