const bcryptjs = require("bcryptjs");
const defaultPassword = require("../../config/defaultPass");

const validasiInput = require("./validasi/validasi_create_guru");
const validasiNIK = require("./validasi/validasi_nik");
const validasiEmail = require("./validasi/validasi_email");

let pass = "";
let image = "";

module.exports = createGuru = async (conn, data, cb) => {
  await validasiInput(data, async (err, good) => {
    if (err) {
      cb(err);
    } else if (good) {
      if (data.password) {
        pass = data.password;
      }
      await bcryptjs.hash(pass ? pass : defaultPassword, 10, async (err, hash) => {
        if (err) {
          cb(err);
        } else if (hash) {
          await validasiNIK(conn, data.nik, async (err, result) => {
            if (err) {
              cb(err);
            } else if (result) {
              await validasiEmail(conn, data.email, async (err, email) => {
                if (err) {
                  cb(err);
                } else if (email) {
                  if (data.kelamin === "0") {
                    image = "default_f.png";
                  } else {
                    image = "default.png";
                  }
                  await conn.query(
                    "INSERT INTO tbl_guru (nama,email,jenis_kelamin,nik,password, kelas, foto) VALUES (?,?,?,?,?,0,?)",
                    [
                      data.nama,
                      data.email,
                      data.kelamin,
                      data.nik,
                      hash,
                      image,
                    ],
                    (err, added) => {
                      if (err) {
                        cb(err);
                      } else if (added) {
                        cb(null, {
                          status: 200,
                          data: {
                            query: added,
                            msg: "Berhasil menambahkan guru",
                          },
                        });
                      } else {
                        cb({
                          status: 400,
                          msg: "Gagal menambahkan data guru",
                        });
                      }
                    }
                  );
                } else {
                  cb({
                    status: 500,
                    msg: "Internal server error",
                  });
                }
              });
            } else {
              cb({
                status: 500,
                msg: "Internal server error",
              });
            }
          });
        } else {
          cb({
            status: 500,
            msg: "Internal server error",
          });
        }
      });
    } else {
      cb({
        status: 500,
        msg: "Gagal memvalidasi data",
      });
    }
  });
};
