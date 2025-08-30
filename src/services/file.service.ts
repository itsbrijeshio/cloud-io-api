import { Document } from "mongoose";
import { IFile, ISanitizeFile } from "../types/file";
import { File } from "../models";
import { ApiError } from "../utils";
import UserService from "./user.service";

const userService = new UserService();

class FileService {
  private sanitize(file: Document): ISanitizeFile {
    const { __v, ...sanitizedFile } =
      file?.toJSON?.() || file?.toObject?.() || file;
    return sanitizedFile as ISanitizeFile;
  }

  private async isUniqueFile(
    owner: string,
    folder: string,
    name: string
  ): Promise<boolean> {
    const isFile = await File.findOne({ owner, folder, name });
    if (isFile) {
      throw new ApiError({
        statusCode: 409,
        code: "CONFLICT",
        message: "File already exists",
      });
    }
    return !!isFile;
  }

  public async uploadFile(
    owner: string,
    folder: string,
    data: Record<string, string | number | undefined | null>
  ): Promise<IFile> {
    const file = await File.create({ ...data, owner, folder });
    await userService.updateStorage(owner, data.size as number, true);
    return this.sanitize(file);
  }

  public async renameFile(
    owner: string,
    _id: string,
    name: string
  ): Promise<IFile> {
    const file = await this.getFileById(owner, _id);
    await this.isUniqueFile(owner, String(file?.folder), name);

    const renamedFile = await File.findByIdAndUpdate(
      _id,
      { name },
      { new: true }
    );
    if (!renamedFile) {
      throw new ApiError({
        statusCode: 404,
        code: "NOT_FOUND",
        message: "File not found",
      });
    }

    return this.sanitize(renamedFile);
  }

  public async moveFile(
    owner: string,
    _id: string,
    folder: string
  ): Promise<IFile> {
    const file = await this.getFileById(owner, _id);
    await this.isUniqueFile(owner, folder, file.name);

    const movedFile = await File.findByIdAndUpdate(
      _id,
      { folder },
      { new: true }
    );
    if (!movedFile) {
      throw new ApiError({
        statusCode: 404,
        code: "NOT_FOUND",
        message: "File not found",
      });
    }

    return this.sanitize(movedFile);
  }

  public async getFileById(owner: string, _id: string): Promise<IFile> {
    const file = await File.findOne({ owner, _id });
    if (!file) {
      throw new ApiError({
        statusCode: 404,
        code: "NOT_FOUND",
        message: "File not found",
      });
    }
    return this.sanitize(file);
  }

  // TODO: download
  public async downloadFile(owner: string, _id: string): Promise<IFile> {
    const file = await this.getFileById(owner, _id);
    return file;
  }

  public async deleteFile(owner: string, _id: string): Promise<IFile> {
    const file = await File.findOneAndDelete({ owner, _id });
    if (!file) {
      throw new ApiError({
        statusCode: 404,
        code: "NOT_FOUND",
        message: "File not found",
      });
    }
    await userService.updateStorage(owner, file.size, false);
    return this.sanitize(file);
  }
}

export default FileService;
