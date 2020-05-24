const validateDataLapor = (data, cb) => {
  let validasi = [];
  if (!data.file) {
    validasi.push({
      error: 'Bukti diperlukan',
    });
  }
  if (!data.nama) {
    validasi.push({
      error: 'Nama diperlukan',
    });
  }
  if (!data.keterangan) {
    validasi.push({
      error: 'Keterangan diperlukan',
    });
  }
  if (!data.kelas) {
    validasi.push({
      error: 'Kelas diperlukan',
    });
  }
  validasi.length > 0 ? cb(validasi) : cb(null, true);
};

module.exports = laporRusak = async (conn, data, cb) => {
  validateDataLapor(data, (wrong, save) => {
    wrong
      ? cb(wrong)
      : conn.query(
          'INSERT INTO tbl_lapor (pelapor,keterangan,id_kelas,bukti,status) VALUES (?,?,?,?,0)',
          [data.nama, data.keterangan, data.kelas, data.file.filename],
          (err, inserted) => {
            err
              ? cb(err)
              : cb(null, {
                  status: 200,
                  data: inserted,
                  msg: 'Laporan berhasil dibuat',
                });
          }
        );
  });
};
