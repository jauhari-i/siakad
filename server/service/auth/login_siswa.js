const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validasi = require("./validasi/validasi_login_siswa");
const SECRET_TOKEN = require("../../config/secret");

module.exports = loginSiswa = async (conn, data, cb) => {
  await validasi(data, (err, good) => {
    if (err) {
      cb(err);
    } else if (good) {
      conn.query(
        "SELECT * FROM tbl_siswa WHERE email = ?",
        data.email,
        (err, siswa) => {
          if (err) {
            cb(err);
          } else if (siswa.length > 0) {
            bcrypt.compare(data.password, siswa[0].password, (err, isMatch) => {
              if (err) {
                cb(err);
              } else if (isMatch) {
                let token = jwt.sign(
                  { email: siswa[0].email, role: 0 },
                  SECRET_TOKEN,
                  {
                    expiresIn: "24h",
                  }
                );
                cb(null, {
                  status: 200,
                  loggedIn: true,
                  token: token,
                  email: siswa[0].email,
                  role: "Student",
                });
              } else {
                cb({
                  status: 400,
                  msg: "Password yang dimasukkan salah",
                });
              }
            });
          } else {
            cb({
              status: 404,
              msg: "Siswa tidak ditemukan",
            });
          }
        }
      );
    } else {
      cb({
        status: 500,
        msg: "Gagal memvalidasi data",
      });
    }
  });
};
