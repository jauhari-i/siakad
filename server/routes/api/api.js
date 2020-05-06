const express = require("express");
const app = express();

// controller
const authController = require("../../controller/authController");
const guruController = require("../../controller/guruController");

// middleware
const checkToken = require("../../config/middleware/cekToken");
const checkGuru = require("../../config/middleware/cekGuru");
const cekAdmin = require("../../config/middleware/cekAdmin");
const hasImage = require("../../config/middleware/hasImage");
const uploadBukti = require("../../config/middleware/uploadBukti");

app.get("/", (req, res) => res.send("Welcome To Siakad API v2"));

// auth
app.post("/login/siswa", authController.loginSiswa);
app.post("/login/guru", authController.loginGuru);

// create/ add
app.post("/create/guru", [checkToken, checkGuru, hasImage], guruController.createGuru);

// read
app.get("/read/guru/img", [checkToken, checkGuru], guruController.readOwnImage);
app.get("/read/guru", [checkToken, checkGuru], guruController.readOwnData);
app.get("/read/guru/all", [checkToken], guruController.readAllGuru)
app.get("/absen/guru", [checkToken, checkGuru], guruController.absenGuru);
app.get("/absen/siswa/:id/:status", [checkToken, checkGuru], guruController.absenAnakWali);
app.get("/absen/cek", [checkToken, checkGuru], guruController.cekAbsen);
app.get("/siswa/wali", [checkToken, checkGuru], guruController.readAnakWali);

// update
app.put("/edit/pass/guru", [checkToken, checkGuru], guruController.updatePass);
app.put("/edit/data/guru", [checkToken, checkGuru, hasImage], guruController.updateGuruData);

// delete
app.delete("/delete/guru/:nik", [checkToken, checkGuru], guruController.deleteGuru);

module.exports = app;
