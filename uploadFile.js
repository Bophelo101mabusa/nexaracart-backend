const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ROOT: C:\Users\...\NexaraCart-main\NexaraCart-main\photos
const baseUploadPath = path.join(process.cwd(), "photos");

// ensure folders exist
const categoryPath = path.join(baseUploadPath, "category");
const productPath = path.join(baseUploadPath, "product");
const posterPath = path.join(baseUploadPath, "posters");

[categoryPath, productPath, posterPath].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// helper: file filter
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const ext = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (ext) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg, .png files are allowed!"));
  }
};

// ================= CATEGORY =================
const storageCategory = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, categoryPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "_" + Math.floor(Math.random() * 1000) + path.extname(file.originalname)
    );
  },
});

// ================= PRODUCT =================
const storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, productPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// ================= POSTERS =================
const storagePoster = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, posterPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// limits shared
const limits = {
  fileSize: 1024 * 1024 * 5, // 5MB
};

// exports
const uploadCategory = multer({
  storage: storageCategory,
  limits,
  fileFilter,
});

const uploadProduct = multer({
  storage: storageProduct,
  limits,
  fileFilter,
});

const uploadPosters = multer({
  storage: storagePoster,
  limits,
  fileFilter,
});

module.exports = {
  uploadCategory,
  uploadProduct,
  uploadPosters,
};