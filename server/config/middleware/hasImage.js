const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public/img",
  filename: function (req, file, cb) {
    cb(null, "img" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
}).single("foto");

module.exports = upload;
