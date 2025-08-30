import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // hashed (null if Google OAuth)
    avatar: { type: String }, // profile picture

    // Storage management
    storageUsed: { type: Number, default: 0 }, // in bytes
    storageQuota: { type: Number, default: 1024 * 1024 * 1024 }, // 1GB default
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
