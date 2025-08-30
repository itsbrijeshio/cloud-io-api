import { Document } from "mongoose";
import { CreateFolder, IFolder, ISanitizeFolder } from "../types/folder";
import { File, Folder } from "../models";
import { ApiError } from "../utils";
import { IFile, ISanitizeFile } from "../types/file";
import FileService from "./file.service";

interface File {
  files: IFile[];
}

type A = Document & File;

const fileService = new FileService();

class FolderService {
  private sanitize(folder: Document): ISanitizeFolder {
    const { __v, ...sanitizedFolder } =
      folder?.toJSON?.() || folder?.toObject?.() || folder;
    return sanitizedFolder as ISanitizeFolder;
  }

  private async isUniqueFolder(
    owner: string,
    parent: string | undefined,
    name: string
  ): Promise<boolean> {
    const isFolder = await Folder.findOne({ owner, name, parent });
    if (isFolder) {
      throw new ApiError({
        statusCode: 409,
        code: "CONFLICT",
        message: "Folder already exists",
      });
    }
    return !!isFolder;
  }

  private async getFolderById(owner: string, _id: string): Promise<IFolder> {
    const folder = await Folder.findOne({ owner, _id });
    if (!folder) {
      throw new ApiError({
        statusCode: 404,
        code: "NOT_FOUND",
        message: "Folder not found",
      });
    }
    return this.sanitize(folder);
  }

  public async getFolder(owner: string, _id: string): Promise<unknown> {
    const folder = await Folder.findOne({ owner, _id })
      .lean()
      .select("-owner -__v")
      .populate("parent", "name")
      .populate("path", "name");
    if (!folder) {
      throw new ApiError({
        statusCode: 404,
        code: "NOT_FOUND",
        message: "Folder not found",
      });
    }

    const subFolders = await Folder.find({
      owner,
      parent: folder._id,
    })
      .lean()
      .select("-owner -parent -__v")
      .populate("path", "name");
    const files = await File.find({ owner, folder: folder._id })
      .lean()
      .select("-owner -folder -__v")
      .populate("path", "name");

    return { folder, subFolders, files };
  }

  public async createFolder(
    owner: string,
    data: CreateFolder
  ): Promise<IFolder> {
    await this.isUniqueFolder(owner, data.parent, data.name);

    const folder = await Folder.create({ ...data, owner });
    return this.sanitize(folder);
  }

  public async renameFolder(
    owner: string,
    _id: string,
    name: string
  ): Promise<IFolder> {
    const folder = await Folder.findById(_id);

    const renamedFolder = await Folder.findByIdAndUpdate(
      _id,
      { name },
      { new: true }
    );
    if (!renamedFolder) {
      throw new ApiError({
        statusCode: 404,
        code: "NOT_FOUND",
        message: "Folder not found",
      });
    }

    const parent = folder?.parent ? String(folder?.parent) : undefined;
    await this.isUniqueFolder(owner, parent, name);

    return this.sanitize(renamedFolder);
  }

  public async moveFolder(
    owner: string,
    _id: string,
    parent: string
  ): Promise<IFolder> {
    const folder = await this.getFolderById(owner, _id);

    await this.isUniqueFolder(owner, parent, folder.name);

    const movedFolder = await Folder.findByIdAndUpdate(
      _id,
      { parent },
      { new: true }
    );
    if (!movedFolder) {
      throw new ApiError({
        statusCode: 404,
        code: "NOT_FOUND",
        message: "Folder not found",
      });
    }

    return this.sanitize(movedFolder);
  }

  public async deleteFolder(owner: string, _id: string): Promise<IFolder> {
    // TODO: Delete all files in folder
    const folder = await Folder.findOneAndDelete({ owner, _id });
    if (!folder) {
      throw new ApiError({
        statusCode: 404,
        code: "NOT_FOUND",
        message: "Folder not found",
      });
    }
    return this.sanitize(folder);
  }

  public async getRootFolders(owner: string): Promise<unknown> {
    const subFolders = await Folder.find({ owner, parent: null })
      .lean()
      .select("-owner -parent -path -__v")
      .sort({ updatedAt: -1 });
    const files = await File.find({ owner, folder: null })
      .lean()
      .select("-owner -folder -path -__v")
      .sort({ updatedAt: -1 });
    return { subFolders, files };
  }
}

export default FolderService;
