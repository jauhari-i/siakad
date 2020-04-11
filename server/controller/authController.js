const _loginSiswa = require("../service/auth/login_siswa");
const _loginGuru = require("../service/auth/login_guru");

const controller = {
  loginSiswa: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        res.send(err);
      } else {
        let data = req.body;
        _loginSiswa(conn, data, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        });
      }
    });
  },
  loginGuru: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        res.send(err);
      } else {
        let data = req.body;
        _loginGuru(conn, data, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        });
      }
    });
  },
};

module.exports = controller;
