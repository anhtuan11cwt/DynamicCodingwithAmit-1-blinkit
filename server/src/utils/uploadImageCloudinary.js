import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET_KEY
) {
  throw new Error(
    "Vui lòng cung cấp CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY và CLOUDINARY_API_SECRET_KEY trong file .env",
  );
}

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

const uploadImageCloudinary = (file, folder = "1-blinkit") => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(upload);
  });
};

const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== "string" || !url.includes("/upload/")) {
    return null;
  }

  const afterUpload = url.split("/upload/")[1];
  const parts = afterUpload.split("/");

  let start = 0;
  if (parts[0].startsWith("v") && /^\d+$/.test(parts[0].slice(1))) {
    start = 1;
  }

  const publicIdWithExt = parts.slice(start).join("/");

  return publicIdWithExt.replace(/\.[^/.]+$/, "");
};

const deleteImageCloudinary = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  });
};

export { deleteImageCloudinary, getPublicIdFromUrl };
export default uploadImageCloudinary;
