import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file (from multer.memoryStorage -> buffer)
const cloudinaryUpload = async (fileBuffer, folder = "uploads") => {
  try {
    if (!fileBuffer) return null;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // buffer ko cloudinary stream me bhej do
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    return null;
  }
};

// Delete file from cloudinary
const cloudinaryDelete = async (public_id) => {
  try {
    if (!public_id) return null;
    const response = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    return null;
  }
};

export { cloudinaryUpload, cloudinaryDelete };
