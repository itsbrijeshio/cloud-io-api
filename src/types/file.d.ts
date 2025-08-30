import { Document, ObjectId } from "mongoose";

export interface ISanitizeFile
  extends Pick<Document, "toJSON" | "toObject">,
    IFile {}

export interface IFile {
  _id: ObjectId;
  name: string;
  owner?: string;
  folder?: string;
  type: string;
  size: number;
  storagePath: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFile {
  name: string;
  type: string;
  size: number;
  storagePath: string;
}
