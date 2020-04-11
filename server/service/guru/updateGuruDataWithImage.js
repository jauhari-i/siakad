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

module.exports = updateGuruWithImage = async (conn, data, nik, file, cb) => {
  await _getOldData(conn, nik, (err, oldData) => {
    if (err) {
      cb(err);
    } else {
      validasi(data, (err, isGood) => {
        if (err) {
          cb(err);
        } else if (isGood) {
          conn.query(
            "UPDATE tbl_guru SET nama = ?, jenis_kelamin = ?, kelas = ?, foto = ? WHERE nik = ?",
            [data.nama, data.kelamin, data.kelas ? data.kelas : oldData.kelas, file.filename, nik],
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
