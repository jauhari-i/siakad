module.exports = validasi = (data, cb) => {
  let validasi = [];
  if (!data.nis) {
    validasi.push({
      error: "NIS diperlukan",
    });
  }
  if (!data.nama) {
    validasi.push({
      error: "Nama diperlukan",
    });
  }
  if (!data.email) {
    validasi.push({
      error: "Email diperlukan",
    });
  }
  if (!data.kelas) {
    validasi.push({
      error: "Kelas diperlukan",
    });
  }
  if (validasi.length > 0) {
    cb(validasi);
  } else {
    cb(null, true);
  }
};
