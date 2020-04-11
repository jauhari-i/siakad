let checkGuru = (req, res, next) => {
  let decoded = req.decoded;
  if (decoded.role !== 3) {
    return res.status(403).json({
      msg: "Terlarang",
    });
  } else {
    next();
  }
};

module.exports = checkGuru;
