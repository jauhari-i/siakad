module.exports = validasiNIK = (conn, email, cb) => {
  conn.query("SELECT * FROM tbl_guru WHERE email = ?", email, (err, guru) => {
    if (err) {
      cb(err);
    } else if (guru.length > 0) {
      cb({
        status: 401,
        msg: "Email telah dipakai",
      });
    } else {
      cb(null, true);
    }
  });
};
