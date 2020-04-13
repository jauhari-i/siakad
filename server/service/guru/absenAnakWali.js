// on going
const date = require("../../constant/date");

const _getIdGuru = async (conn, nik, cb) => {
  await conn.query("SELECT kelas FROM tbl_guru WHERE nik = ?", nik, (err, kls) => {
    if (err) {
      cb(err);
    } else if (kls.length > 0) {
      cb(null, kls[0].kelas);
    } else {
      cb({
        status: 404,
        msg: "Tidak ditemukan",
      });
    }
  });
};

const _getKelasSiswa = async (conn, id, cb) => {
  await conn.query("SELECT kelas FROM tbl_siswa WHERE id_siswa = ?", id, (err, kls) => {
    if (err) {
      cb(err);
    } else if (kls.length > 0) {
      cb(null, kls[0].kelas);
    } else {
      cb({
        status: 404,
        msg: "Tidak ditemukan",
      });
    }
  });
};

const _cekAnakWali = async (conn, id, nik, cb) => {
  await _getIdGuru(conn, nik, (err, kelas) => {
    if (err) {
      cb(err);
    } else {
      if (kelas === 0) {
        cb({
          status: 403,
          msg: "Anda bukan wali kelas!",
        });
      } else {
        _getKelasSiswa(conn, id, (err, kelasSiswa) => {
          if (err) {
            cb(err);
          } else {
            if (kelas !== kelasSiswa) {
              cb({
                status: 403,
                msg: "Anda bukan wali kelas siswa ini!",
              });
            } else {
              _cekAbsensi(conn, id, (err, isAbsen, notAbsen) => {
                if (err) {
                  cb(err);
                } else if (isAbsen) {
                  cb(null, isAbsen);
                } else if (notAbsen) {
                  cb(null, null, true);
                } else {
                  cb({
                    status: 500,
                    msg: "Internal server error",
                  });
                }
              });
            }
          }
        });
      }
    }
  });
};

const _cekAbsensi = async (conn, id, cb) => {
  await conn.query(
    "SELECT * FROM tbl_absen_siswa WHERE id_siswa = ? AND tgl >= ? AND tgl < ?",
    [id, date.dateToday, date.dateTommorrow],
    (err, absen) => {
      if (err) {
        cb(err);
      } else if (absen.length > 0) {
        let siswa = absen[0];
        if (siswa.status === 1) {
          cb(null, {
            status: 200,
            msg: "Siswa sudah melakukan absensi hari ini",
            status_kehadiran: "Masuk",
            kehadiran_kode: 1,
          });
        } else if (siswa.status === 2) {
          cb(null, {
            status: 200,
            msg: "Siswa sakit hari ini",
            status_kehadiran: "Sakit",
            kehadiran_kode: 2,
          });
        } else if (siswa.status === 3) {
          cb(null, {
            status: 200,
            msg: "Siswa mendapatkan Izin",
            status_kehadiran: "Izin",
            kehadiran_kode: 3,
          });
        } else if (siswa.status === 4) {
          cb(null, {
            status: 200,
            msg: "Siswa mendapatkan Dispensasi",
            status_kehadiran: "Dispensasi",
            kehadiran_kode: 4,
          });
        } else {
          cb(null, {
            status: 200,
            msg: "Siswa tidak melakukan absensi hari ini",
            status_kehadiran: "Alpha",
            kehadiran_kode: 0,
          });
        }
      } else {
        cb(null, null, true);
      }
    }
  );
};

const _noBukti = async (conn, id, status, cb) => {
  await conn.query(
    "INSERT INTO tbl_absen_siswa (tgl,id_siswa,status) VALUES (NOW(),?,?)",
    [id, status],
    (err, absen) => {
      if (err) {
        cb(err);
      } else if (absen) {
        cb(null, {
          status: 200,
          msg: "Siswa telah diabsenkan",
          kehadiran_kode: status,
        });
      } else {
        cb({
          status: 400,
          msg: "Gagal mengabsenkan siswa",
        });
      }
    }
  );
};

const _hasBukti = async (conn, id, status, bukti, cb) => {
  await conn.query(
    "INSERT INTO tbl_absen_siswa (tgl,id_siswa,status,bukti) VALUES (NOW(),?,?,?)",
    [id, status, bukti],
    (err, absen) => {
      if (err) {
        cb(err);
      } else if (absen) {
        cb(null, {
          status: 200,
          msg: "Siswa telah diabsenkan",
          kehadiran_kode: status,
        });
      } else {
        cb({
          status: 400,
          msg: "Gagal mengabsenkan siswa",
        });
      }
    }
  );
};

module.exports = absenWali = async (conn, id, nik, data, cb) => {
  await _cekAnakWali(conn, id, nik, (err, isAbsen, notAbsen) => {
    if (err) {
      cb(err);
    } else if (isAbsen) {
      cb(null, isAbsen);
    } else if (notAbsen) {
      if (data.file) {
        _hasBukti(conn, id, data.status, data.file, (err, absen) => {
          if (err) {
            cb(err);
          } else {
            cb(null, absen);
          }
        });
      } else {
        _noBukti(conn, id, data.status, (err, absen) => {
          if (err) {
            cb(err);
          } else {
            cb(null, absen);
          }
        });
      }
    } else {
      cb({
        status: 500,
        msg: "Internal server error",
      });
    }
  });
};
