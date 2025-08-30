import argon2 from "argon2";
import { User } from "../models";
import { Document } from "mongoose";
import { ISanitizeUser, IUser, LoginUser, RegisterUser } from "../types/user";
import { ApiError } from "../utils";

class UserService {
  private sanitize(user: Document): ISanitizeUser {
    const { password, __v, ...sanitizedUser } =
      user?.toJSON?.() || user?.toObject?.() || user;
    return sanitizedUser as ISanitizeUser;
  }

  private async hashedPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  private async isUniqueEmail(email: string): Promise<boolean> {
    const isUser = await User.findOne({ email });
    if (isUser) {
      throw new ApiError({
        statusCode: 409,
        code: "CONFLICT",
        message: "Email already exists",
      });
    }
    return !!isUser;
  }

  public async updateStorage(
    _id: string,
    size: number,
    isInc: boolean = true
  ): Promise<IUser> {
    const user = await User.findById(_id);
    if (!user) {
      throw new ApiError({
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "you are not authorized",
      });
    }
    if (isInc) {
      user.storageUsed = user.storageUsed + size;
    } else {
      user.storageUsed = user.storageUsed - size;
    }

    await user.save();
    return this.sanitize(user);
  }

  public async register(data: RegisterUser): Promise<IUser> {
    await this.isUniqueEmail(data.email);

    const hashedPassword = await this.hashedPassword(data.password);
    const user = await User.create({ ...data, password: hashedPassword });
    return this.sanitize(user);
  }

  public async login(data: LoginUser): Promise<IUser> {
    const user = await User.findOne({ email: data.email });
    if (!user || !user?.password) {
      throw new ApiError({
        statusCode: 404,
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const isValidPassword = await argon2.verify(user?.password, data.password);
    if (!isValidPassword) {
      throw new ApiError({
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "Invalid credentials",
      });
    }
    return this.sanitize(user);
  }

  public async getUser(_id: string): Promise<IUser> {
    const user = await User.findById(_id);
    if (!user) {
      throw new ApiError({
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "you are not authorized",
      });
    }
    return this.sanitize(user);
  }

  public async updateUser(_id: string, data: Partial<IUser>): Promise<IUser> {
    if (data.email) {
      await this.isUniqueEmail(data.email);
    }

    const user = await User.findByIdAndUpdate(_id, data, { new: true });
    if (!user) {
      throw new ApiError({
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "you are not authorized",
      });
    }
    return this.sanitize(user);
  }

  public async deleteUser(_id: string): Promise<IUser> {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      throw new ApiError({
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "you are not authorized",
      });
    }
    return this.sanitize(user);
  }

  public async updateAvatar(_id: string, avatar: string): Promise<IUser> {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { avatar },
      { new: true }
    );
    if (!updatedUser) {
      throw new ApiError({
        statusCode: 401,
        code: "UNAUTHORIZED",
        message: "you are not authorized",
      });
    }
    return this.sanitize(updatedUser);
  }
}

export default UserService;
