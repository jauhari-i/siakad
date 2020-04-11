module.exports = validasi = (data, cb) => {
  let validation = [];
  if (!data.email) {
    validation.push({
      error: "Email dibutuhkan",
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
