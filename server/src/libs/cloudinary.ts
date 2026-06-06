import cloudinary from "@/configs/cloudinary.config";

export const uploadToCloudinary = async (filePath:string, folder = "bmv") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "image",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    throw new Error("Cloudinary upload failed");
  }
};