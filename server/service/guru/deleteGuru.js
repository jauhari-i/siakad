_cekGuru = (conn, nik, cb) => {
  conn.query("SELECT * FROM tbl_guru WHERE nik = ?", nik, (err, guru) => {
    if (err) {
      cb(err);
    } else if (guru.length > 0) {
      cb(null, true);
    } else {
      cb({
        status: 404,
        msg: "Data guru tidak ditemukan",
      });
    }
  });
};

module.exports = deleteGuru = async (conn, nik, cb) => {
  await _cekGuru(conn, nik, (err, result) => {
    if (err) {
      cb(err);
    } else {
      conn.query("DELETE FROM tbl_guru WHERE nik = ?", nik, (err, deleted) => {
        if (err) {
          cb(err);
        } else if (deleted) {
          cb(null, {
            status: 200,
            deleted: true,
          });
        } else {
          cb({
            status: 500,
            msg: "Gagal menghapus guru",
          });
        }
      });
    }
  });
};
