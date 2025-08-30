import { Document, ObjectId } from "mongoose";
import { IFile } from "./file";

export interface ISanitizeFolder
  extends Pick<Document, "toJSON" | "toObject">,
    IFolder {}

export interface IFolder {
  _id: ObjectId;
  name: string;
  owner?: string;
  parent?: string;
  path: ObjectId[];
  files: IFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFolder {
  name: string;
  parent: string;
}
