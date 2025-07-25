import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".pdf"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and pdf allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
