const moment = require("moment");

let dateToday = moment().format("YYYY-MM-DD");
let dateTimeToday = moment().format("YYYY-MM-DD HH:MM:SS");
let dateTommorrow = moment().add(1, "d").format("YYYY-MM-DD");

const _getIdGuru = async (conn, nik, cb) => {
  await conn.query("SELECT id_guru FROM tbl_guru WHERE nik = ?", nik, (err, id) => {
    if (err) {
      cb(err);
    } else if (id.length > 0) {
      cb(null, id[0].id_guru);
    } else {
      cb({
        status: 404,
        msg: "Tidak ditemukan",
      });
    }
  });
};

const _cekAbsen = async (conn, id, cb) => {
  await conn.query(
    "SELECT * FROM tbl_absen_guru WHERE id_guru = ? AND tgl >= ? AND tgl < ? ",
    [id, dateToday, dateTommorrow],
    (err, absen) => {
      if (err) {
        cb(err);
      } else if (absen.length > 0) {
        if (absen[0].status === 1) {
          cb({
            status: 200,
            msg: "Anda sudah melakukan absensi hari ini",
            status_kehadiran: "Masuk",
            kehadiran_kode: 1,
          });
        } else if (absen[0].status === 2) {
          cb({
            status: 200,
            msg: "Anda sudah melakukan absensi hari ini",
            status_kehadiran: "Sakit",
            kehadiran_kode: 2,
          });
        } else if (absen[0].status === 3) {
          cb({
            status: 200,
            msg: "Anda sudah melakukan absensi hari ini",
            status_kehadiran: "Izin",
            kehadiran_kode: 3,
          });
        } else if (absen[0].status === 4) {
          cb({
            status: 200,
            msg: "Anda sudah melakukan absensi hari ini",
            status_kehadiran: "Dispensasi",
            kehadiran_kode: 4,
          });
        } else {
          cb({
            status: 200,
            msg: "Anda tidak melakukan absensi hari ini",
            status_kehadiran: "Alpha",
            kehadiran_kode: 0,
          });
        }
      } else {
        cb(null, true);
      }
    }
  );
};

const _absenGuru = async (conn, id, cb) => {
  await conn.query(
    "INSERT INTO tbl_absen_guru (tgl,id_guru,status) VALUES (NOW(),?,1)",
    id,
    (err, absen) => {
      if (err) {
        cb(err);
      } else if (absen) {
        cb(null, {
          status: 200,
          tgl: dateTimeToday,
          absen: true,
        });
      } else {
        cb({
          status: 500,
          msg: "Internal server error",
        });
      }
    }
  );
};

const _absen = async (conn, nik, cb) => {
  await _getIdGuru(conn, nik, (err, id) => {
    if (err) {
      cb(err);
    } else {
      _cekAbsen(conn, id, (err, isAbsen) => {
        if (err) {
          cb(err);
        } else {
          _absenGuru(conn, id, (err, absen) => {
            if (err) {
              cb(err);
            } else {
              cb(null, absen);
            }
          });
        }
      });
    }
  });
};

const _cek = async (conn, nik, cb) => {
  await _getIdGuru(conn, nik, (err, id) => {
    if (err) {
      cb(err);
    } else {
      _cekAbsen(conn, id, (err, isAbsen) => {
        if (err) {
          cb(err);
        } else {
          cb(null, {
            absen: !isAbsen,
            status: 200,
            msg: "Anda belum melakukan absensi hari ini",
          });
        }
      });
    }
  });
};

const absenService = {
  absenGuru: async (conn, nik, cb) => {
    await _absen(conn, nik, (err, result) => {
      if (err) {
        cb(err);
      } else {
        cb(null, result);
      }
    });
  },
  cekAbsen: async (conn, nik, cb) => {
    await _cek(conn, nik, (err, result) => {
      if (err) {
        cb(err);
      } else {
        cb(null, result);
      }
    });
  },
};

module.exports = absenService;
