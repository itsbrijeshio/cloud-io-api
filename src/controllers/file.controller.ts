import { Request, Response } from "express";
import { FileService } from "../services";
import { cloudinary } from "../config";
import { ApiError } from "../utils";

class FileController extends FileService {
  constructor() {
    super();
  }

  handleUploadFile = async (req: Request, res: Response) => {
    const result = await cloudinary.uploadImage(req.file?.path as string);
    if (!result) {
      throw new ApiError({
        statusCode: 500,
        code: "SERVER_ERROR",
        message: "Error uploading file",
      });
    }

    const fileData = {
      type: req.file?.mimetype,
      size: req.file?.size,
      name: req.file?.originalname,
      storagePath: result.secure_url,
    };

    const file = await this.uploadFile(req.auth._id, req.body.folder, fileData);
    res.status(201).json(file);
  };

  handleGetFile = async (req: Request, res: Response) => {
    const file = await this.getFileById(req.auth._id, req.params._id);
    res.status(200).json(file);
  };

  handleDownloadFile = async (req: Request, res: Response) => {
    const { storagePath, name } = await this.downloadFile(
      req.auth._id,
      req.params._id
    );
    res.download(storagePath, name);
    res.status(200).json({ message: "File downloaded successfully" });
  };

  handleRenameFile = async (req: Request, res: Response) => {
    const file = await this.renameFile(
      req.auth._id,
      req.params._id,
      req.body.name
    );
    res.status(200).json(file);
  };

  handleMoveFile = async (req: Request, res: Response) => {
    const file = await this.moveFile(
      req.auth._id,
      req.params._id,
      req.body.folder
    );
    res.status(200).json(file);
  };

  handleDeleteFile = async (req: Request, res: Response) => {
    function extractPublicId(url: string) {
      const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
      return matches ? matches[1] : null;
    }
    const file = await this.getFileById(req.auth._id, req.params._id);
    const result = await cloudinary.deleteImage(
      extractPublicId(file.storagePath) as string
    );
    if (result.result !== "ok") {
      throw new ApiError({
        statusCode: 500,
        code: "SERVER_ERROR",
        message: "Error deleting file",
      });
    }

    const deletedFile = await this.deleteFile(req.auth._id, req.params._id);
    res.status(200).json(deletedFile);
  };
}

export default FileController;
