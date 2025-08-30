import { Request, Response } from "express";
import { FolderService } from "../services";

class FolderController extends FolderService {
  constructor() {
    super();
  }

  handleNewFolder = async (req: Request, res: Response) => {
    const folder = await this.createFolder(req.auth._id, req.body);
    res.status(201).json(folder);
  };

  handleGetRootFolders = async (req: Request, res: Response) => {
    const folders = await this.getRootFolders(req.auth._id);
    res.status(200).json(folders);
  };

  handleGetFolder = async (req: Request, res: Response) => {
    const folders = await this.getFolder(req.auth._id, req.params._id);
    res.status(200).json(folders);
  };

  handleRenameFolder = async (req: Request, res: Response) => {
    const folder = await this.renameFolder(
      req.auth._id,
      req.params._id,
      req.body.name
    );
    res.status(200).json(folder);
  };

  handleDeleteFolder = async (req: Request, res: Response) => {
    const folder = await this.deleteFolder(req.auth._id, req.params._id);
    res.status(200).json(folder);
  };

  handleMoveFolder = async (req: Request, res: Response) => {
    const folder = await this.moveFolder(
      req.auth._id,
      req.params._id,
      req.body.parent
    );
    res.status(200).json(folder);
  };
}

export default FolderController;
