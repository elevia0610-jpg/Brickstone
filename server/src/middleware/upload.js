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

function parseMediaFolder(entity, file) {
  const base = entity === "projects" ? "projects" : "properties";
  const isVideo = file.mimetype.startsWith("video/");
  return `${base}/${isVideo ? "videos" : "images"}`;
}

function createMediaStorage(entity) {
  if (!enabled) return null;
  return new CloudinaryStorage({
    cloudinary,
    params: async (_req, file) => {
      const folder = parseMediaFolder(entity, file);
      const isVideo = file.mimetype.startsWith("video/");

      return {
        folder,
        resource_type: isVideo ? "video" : "image",
        allowed_formats: isVideo
          ? ["mp4", "mov", "avi", "webm"]
          : ["jpg", "jpeg", "png", "webp"],
      };
    }
  });
}

export function uploadPropertyMedia(req, res, next) {
  const storage = createMediaStorage("properties");
  if (!storage) return next();
  return multer({
    storage,
    limits: {
      fileSize: 50 * 1024 * 1024, // allow videos
      files: 11,
    },
    fileFilter: (_req, file, cb) => {
      const ok = file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
      if (!ok) return cb(new Error("Only image/video files are allowed"));
      if (file.fieldname === "video" && !file.mimetype.startsWith("video/")) {
        return cb(new Error("Video field must be a video file"));
      }
      if (file.fieldname === "images" && !file.mimetype.startsWith("image/")) {
        return cb(new Error("Images field must be image files"));
      }
      cb(null, true);
    },
  }).fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ])(req, res, next);
}

export function uploadProjectMedia(req, res, next) {
  const storage = createMediaStorage("projects");
  if (!storage) return next();
  return multer({
    storage,
    limits: {
      fileSize: 50 * 1024 * 1024,
      files: 11,
    },
    fileFilter: (_req, file, cb) => {
      const ok = file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
      if (!ok) return cb(new Error("Only image/video files are allowed"));
      if (file.fieldname === "video" && !file.mimetype.startsWith("video/")) {
        return cb(new Error("Video field must be a video file"));
      }
      if (file.fieldname === "images" && !file.mimetype.startsWith("image/")) {
        return cb(new Error("Images field must be image files"));
      }
      cb(null, true);
    },
  }).fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ])(req, res, next);
}

