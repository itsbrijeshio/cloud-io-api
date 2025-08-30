import { Document, ObjectId } from "mongoose";

export interface ISanitizeUser
  extends Pick<Document, "toJSON" | "toObject">,
    IUser {}

export interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  avatar?: string;
  storageUsed: number;
  storageQuota: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}
