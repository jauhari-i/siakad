const laporRusak = require('../service/lapor/laporRusak');
const readLaporan = require('../service/lapor/readLaporan');
const readLaporanSingle = require('../service/lapor/readLaporanSingle');
const deleteLaporan = require('../service/lapor/deleteLaporan');

const controller = {};

controller.laporRusak = async (req, res) => {
  let data = {
    nama: req.body.nama,
    keterangan: req.body.keterangan,
    kelas: req.body.kelas,
    file: req.file,
  };
  await req.getConnection(async (err, conn) => {
    err
      ? await res.json(err)
      : await laporRusak(conn, data, async (err, result) => {
          err ? await res.json(err) : await res.json(result);
        });
  });
};

controller.readLaporan = async (req, res) => {
  await req.getConnection(async (err, conn) => {
    err
      ? await res.json(err)
      : await readLaporan(conn, async (err, result) => {
          err ? await res.json(err) : await res.json(result);
        });
  });
};

controller.readLaporanSingle = async (req, res) => {
  await req.getConnection(async (err, conn) => {
    err
      ? await res.json(err)
      : await readLaporanSingle(conn, req.params.id, async (err, result) => {
          err ? await res.json(err) : await res.json(result);
        });
  });
};

controller.deleteLaporan = async (req, res) => {
  await req.getConnection(async (err, conn) => {
    err
      ? await res.json(err)
      : await deleteLaporan(conn, req.params.id, async (err, result) => {
          err ? await res.json(err) : await res.json(result);
        });
  });
};

module.exports = controller;
