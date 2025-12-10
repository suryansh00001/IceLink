import cloudinary from "./cloudinary";
import streamifier from "streamifier";

const uploadToCloudinary = async (fileBuffer: Buffer, folder = "icelink") => {
  try {
    return await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: "auto" },
        (error: any, result: any) => {
          if (error) return reject(error);
          if (!result || !result.secure_url) return reject(new Error("Upload failed"));
          resolve(result.secure_url);
        }
      );
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  } catch (err: any) {
    throw new Error(`Cloudinary upload error: ${err.message || err}`);
  }
};

export default uploadToCloudinary;
