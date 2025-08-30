import { Request, Response } from "express";
import { UserService } from "../services";
import { signCookie } from "../utils";

class UserController extends UserService {
  constructor() {
    super();
  }

  handleRegister = async (req: Request, res: Response) => {
    const user = await this.register(req.body);
    res.status(201).json(user);
  };

  handleLogin = async (req: Request, res: Response) => {
    const user = await this.login(req.body);
    const token = signCookie(res, user?._id);
    res.status(200).json({ token });
  };

  handleGetUser = async (req: Request, res: Response) => {
    const user = await this.getUser(req.auth._id);
    res.status(200).json(user);
  };

  handleUpdateUser = async (req: Request, res: Response) => {
    console.log(req.file, req.files);
    const user = await this.updateUser(req.auth._id, req.body);
    res.status(200).json(user);
  };

  handleDeleteUser = async (req: Request, res: Response) => {
    const user = await this.deleteUser(req.auth._id);
    res.clearCookie(process.env.COOKIE_NAME as string);
    res.status(200).json({ message: "User deleted successfully" });
  };

  handleLogout = async (req: Request, res: Response) => {
    res.clearCookie(process.env.COOKIE_NAME as string);
    res.status(200).json({ message: "Logout successfully" });
  };

  handleUpdateAvatar = async (req: Request, res: Response) => {
    const user = await this.updateAvatar(
      req.auth._id,
      req.file?.originalname as string
    );
    res.status(200).json(user);
  };
}

export default UserController;
