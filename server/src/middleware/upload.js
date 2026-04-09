import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { initCloudinary } from "../config/cloudinary.js";

const { enabled, cloudinary } = initCloudinary();

function getStorage() {
  if (!enabled) return null;
  return new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => {
      const ext = file.originalname.split(".").pop()?.toLowerCase();
      const folder = "brickstone";
      return {
        folder,
        resource_type: "image",
        format: ext && ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg",
      };
    },
  });
}

export const uploadEnabled = enabled;

export const uploadSingleImage = (() => {
  const storage = getStorage();
  if (!storage) {
    return (req, _res, next) => {
      req.file = undefined;
      next();
    };
  }

  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (!file.mimetype.startsWith("image/")) {
        cb(new Error("Only image files are allowed"));
        return;
      }
      cb(null, true);
    },
  }).single("image");
})();

