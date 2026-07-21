import multer from "multer";
import path from "path";
import { ApiError } from "../utils";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const ALLOWED_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_EXTS = [".jpg", ".jpeg", ".png"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_TYPES.includes(file.mimetype) && ALLOWED_EXTS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only JPG, JPEG, and PNG files are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_SIZE,
  },
});
