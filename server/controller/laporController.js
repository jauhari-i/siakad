const laporRusak = require('../service/lapor/laporRusak');

const controller = {};

controller.laporRusak = async (req, res) => {
  let data = {
    nama: req.body.nama,
    keterangan: req.body.keterangan,
    kelas: req.body.kelas,
    file: req.file,
  };
  await req.getConnection(async (err, conn) => {
    if (err) {
      res.json(err);
    } else {
      await laporRusak(conn, data, (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.json(result);
        }
      });
    }
  });
};

module.exports = controller;
