module.exports = validasi = (data, cb) => {
  let validation = [];
  if (!data.nik) {
    validation.push({
      error: "NIK dibutuhkan",
    });
  }
  if (!data.password) {
    validation.push({
      error: "Password dibutuhkan",
    });
  }

  if (validation.length > 0) {
    cb(validation);
  } else {
    cb(null, true);
  }
};
