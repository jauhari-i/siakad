module.exports = validasiNIK = (conn, nik, cb) => {
  conn.query("SELECT * FROM tbl_guru WHERE nik = ?", nik, (err, guru) => {
    if (err) {
      cb(err);
    } else if (guru.length > 0) {
      cb({
        status: 401,
        msg: "NIK telah dipakai",
      });
    } else {
      cb(null, true);
    }
  });
};
