const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validasi = require('./validasi/validasi_login_siswa');
const SECRET_TOKEN = require('../../config/secret');
const date = require('../../constant/date');

const _getAbsen = async (conn, id, cb) => {
  await conn.query(
    'SELECT * FROM tbl_absen_siswa WHERE id_siswa = ? AND tgl >= ? AND tgl < ?',
    [id, date.dateToday, date.dateTommorrow],
    (err, absen) => {
      if (err) {
        cb(err);
      } else if (absen.length > 0) {
        let absenM = absen[0];
        if (absenM.status === 1) {
          cb(null, 'Masuk');
        } else if (absenM.status === 2) {
          cb(null, 'Sakit');
        } else if (absenM.status === 3) {
          cb(null, 'Izin');
        } else if (absenM.status === 4) {
          cb(null, 'Dispen');
        }
      } else {
        cb(null, 'Belum Absen');
      }
    }
  );
};

module.exports = loginSiswa = async (conn, data, cb) => {
  await validasi(data, (err, good) => {
    if (err) {
      cb(err);
    } else if (good) {
      conn.query('SELECT * FROM tbl_siswa WHERE email = ?', data.email, (err, siswa) => {
        if (err) {
          cb(err);
        } else if (siswa.length > 0) {
          bcrypt.compare(data.password, siswa[0].password, (err, isMatch) => {
            if (err) {
              cb(err);
            } else if (isMatch) {
              _getAbsen(conn, siswa[0].id_siswa, (err, absen) => {
                if (err) {
                  cb(err);
                } else {
                  let token = jwt.sign({ email: siswa[0].email, role: 0 }, SECRET_TOKEN, {
                    expiresIn: '24h',
                  });
                  cb(null, {
                    status: 200,
                    loggedIn: true,
                    token: token,
                    email: siswa[0].email,
                    role: 'Student',
                    absen: absen,
                  });
                }
              });
            } else {
              cb({
                status: 400,
                msg: 'Password yang dimasukkan salah',
              });
            }
          });
        } else {
          cb({
            status: 404,
            msg: 'Siswa tidak ditemukan',
          });
        }
      });
    } else {
      cb({
        status: 500,
        msg: 'Gagal memvalidasi data',
      });
    }
  });
};
