const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./public/img/bukti",
  filename: function (req, file, cb) {
    cb(null, "img" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
}).single("bukti");

module.exports = upload;
