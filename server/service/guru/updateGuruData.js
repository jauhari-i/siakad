_getOldData = (conn, nik, cb) => {
  conn.query("SELECT * FROM tbl_guru WHERE nik=?", nik, (err, guru) => {
    if (err) {
      cb(err);
    } else if (guru.length > 0) {
      cb(null, guru[0]);
    } else {
      cb({
        status: 404,
        msg: "Data tidak ditemukan",
      });
    }
  });
};

const validasi = require("./validasi/validasi_update_guru");

module.exports = updateGuru = async (conn, data, nik, cb) => {
  await _getOldData(conn, nik, (err, oldData) => {
    if (err) {
      cb(err);
    } else {
      validasi(data, (err, isGood) => {
        if (err) {
          cb(err);
        } else if (isGood) {
          conn.query(
            "UPDATE tbl_guru SET nama = ?, jenis_kelamin = ?, kelas = ? WHERE nik = ?",
            [data.nama, data.kelamin, data.kelas ? data.kelas : oldData.kelas, nik],
            (err, updated) => {
              if (err) {
                cb(err);
              } else if (updated) {
                cb(null, {
                  status: 200,
                  updated: true,
                  data: updated,
                });
              } else {
                cb({
                  status: 500,
                  msg: "Internal server error",
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
    }
  });
};
