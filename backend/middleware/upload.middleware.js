import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/resumes",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/plain") {
    cb(null, true);
  } else {
    cb(new Error("Only .txt files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
