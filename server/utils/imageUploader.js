const cloudinary = require("cloudinary").v2;

// Auto-detect uploader for image & video
exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder };

    if (height) {
      options.height = height;
    }

    if (quality) {
      options.quality = quality;
    }

    // ======================================================
    // 🔥 AUTO DETECT MEDIA TYPE (IMAGE or VIDEO)
    // ======================================================
    const mimeType = file.mimetype;

    if (!mimeType) {
      throw new Error("File mimetype missing");
    }

    if (mimeType.startsWith("image/")) {
      options.resource_type = "image";
    } 
    else if (mimeType.startsWith("video/")) {
      options.resource_type = "video";  // required for duration
    }
    else {
      // fallback (e.g., PDF)
      options.resource_type = "auto";
    }

    // ======================================================
    // Upload to Cloudinary
    // ======================================================
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);

    return result;

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
