const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validasi = require('./validasi/validasi_login_guru');
const SECRET_TOKEN = require('../../config/secret');
const date = require('../../constant/date');

const _getAbsensi = async (conn, id, cb) => {
  await conn.query(
    'SELECT * FROM tbl_absen_guru WHERE id_guru = ? AND tgl >= ? AND tgl < ? ',
    [id, date.dateToday, date.dateTommorrow],
    (err, absen) => {
      if (err) {
        cb(err);
      } else if (absen.length > 0) {
        cb(null, 'Masuk');
      } else {
        cb(null, 'Belum absen');
      }
    }
  );
};

module.exports = loginGuru = async (conn, data, cb) => {
  await validasi(data, (err, good) => {
    if (err) {
      cb(err);
    } else if (good) {
      conn.query('SELECT * FROM tbl_guru WHERE nik = ?', data.nik, (err, guru) => {
        if (err) {
          cb(err);
        } else if (guru.length > 0) {
          bcrypt.compare(data.password, guru[0].password, (err, isMatch) => {
            if (err) {
              cb(err);
            } else if (isMatch) {
              _getAbsensi(conn, guru[0].id_guru, (err, result) => {
                if (err) {
                  cb(err);
                } else {
                  let token = jwt.sign(
                    {
                      nik: guru[0].nik,
                      email: guru[0].email,
                      role: 1,
                    },
                    SECRET_TOKEN,
                    {
                      expiresIn: '24h',
                    }
                  );
                  cb(null, {
                    status: 200,
                    logged: true,
                    role: 'Guru',
                    token: token,
                    absen: result,
                  });
                }
              });
            } else {
              cb({
                status: 400,
                msg: 'Password yang anda masukkan salah',
              });
            }
          });
        } else {
          cb({
            status: 404,
            msg: 'NIK tidak ditemukan',
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
