module.exports = validasi = (data, cb) => {
  let validasi = [];
  if (!data.nama) {
    validasi.push({
      error: "Nama tidak boleh kosong",
    });
  }
  if (!data.kelamin) {
    validasi.push({
      error: "Jenis kelamin tidak boleh kosong",
    });
  }
  if (validasi.length > 0) {
    cb(validasi);
  } else {
    cb(null, true);
  }
};
