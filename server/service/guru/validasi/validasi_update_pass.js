module.exports = validasiUpdatePass = (data, cb) => {
  let validasi = [];
  if (!data.oldPassword) {
    validasi.push({
      error: "Password lama tidak boleh kosong",
    });
  }
  if (!data.password) {
    validasi.push({
      error: "Password tidak boleh kosong",
    });
  }
  if (!data.passwordConfirm) {
    validasi.push({
      error: "Password konfirmasi tidak boleh kosong",
    });
  }

  if (data.password !== data.passwordConfirm) {
    validasi.push({
      error: "Password tidak sama",
    });
  }
  if (validasi.length > 0) {
    cb(validasi);
  } else {
    cb(null, data.password);
  }
};
