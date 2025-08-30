import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";

const env = (env: string) => process.env[env] as string;

// Configuration
cloudinary.config({
  cloud_name: env("CLOUDINARY_CLOUD_NAME"),
  api_key: env("CLOUDINARY_API_KEY"),
  api_secret: env("CLOUDINARY_API_SECRET"), // Click 'View API Keys' above to copy your API secret
});

// Upload an image
const uploadImage = async (filePath: string) => {
  return await cloudinary.uploader
    .upload(filePath, {
      resource_type: "image",
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      fs.unlinkSync(filePath);
    });
};

// Delete an image
const deleteImage = async (publicId: string) => {
  return await cloudinary.uploader.destroy(publicId).catch((error) => {
    console.log(error);
  });
};

export { deleteImage, uploadImage };
