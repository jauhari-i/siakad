module.exports = validasi = (data, cb) => {
  let validasi = [];
  if (!data.nama) {
    validasi.push({
      error: "Nama diperlukan",
    });
  }
  if (!data.nik) {
    validasi.push({
      error: "NIK diperlukan",
    });
  }
  if (!data.email) {
    validasi.push({
      error: "Email diperlukan",
    });
  }
  if (!data.kelamin) {
    validasi.push({
      error: "Jenis kelamin diperlukan",
    });
  }
  if (validasi.length > 0) {
    cb(validasi);
  } else {
    cb(null, true);
  }
};
