import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "node:fs";
import { ApiError } from "../utils";

// Define the absolute path for the uploads directory
const uploadsDirectory = path.join(__dirname, "../../uploads");

// Check if the directory exists, create if not
if (!fs.existsSync(uploadsDirectory)) {
  fs.mkdirSync(uploadsDirectory, { recursive: true });
}

// File filter: only allow images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (...args: unknown[]) => void
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new ApiError({
        statusCode: 400,
        code: "BAD_REQUEST",
        message: "File must be an image",
      }),
      false
    );
  }
};

// file size maximum 10MB
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
export default uploadFile;
