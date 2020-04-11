const bcryptjs = require("bcryptjs");

const validasiPass = require("./validasi/validasi_update_pass");

module.exports = updateGuruPass = async (conn, data, nik, cb) => {
  await validasiPass(data, (err, newPass) => {
    if (err) {
      cb(err);
    } else if (newPass) {
      bcryptjs.hash(newPass, 10, (err, hash) => {
        if (err) {
          cb(err);
        } else if (hash) {
          conn.query(
            "UPDATE tbl_guru SET password = ? WHERE nik = ?",
            [hash, nik],
            (err, updated) => {
              if (err) {
                cb(err);
              } else if (updated) {
                cb(null, {
                  status: 200,
                  updated: true,
                  msg: "Password berhasil diganti",
                });
              } else {
                cb({
                  status: 400,
                  updated: false,
                  msg: "Tidak dapat mengganti password",
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
};
