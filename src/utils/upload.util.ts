import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const checkFolder = (folder: string, callback?: () => void) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
  if (callback) {
    callback();
  }
};

const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    checkFolder("./public/uploads/" + file.fieldname, () => {
      cb(null, "./public/uploads/" + file.fieldname + "/");
    });
  },
  filename: (_req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Limit 3 mb
  fileFilter: (_req, file, cb) => {
    checkFileType(file, cb);
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setFiles = (data: object, files: any, fieldname: Array<string>) => {
  fieldname.forEach((item: string) => {
    if (files[item]) {
      data = {
        ...data,
        [item]: files[item][0].filename,
      };
    }
  });

  return data;
};

export { upload, setFiles };
