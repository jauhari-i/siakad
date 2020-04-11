const jwt = require("jsonwebtoken");
const SECRET_TOKEN = require("../secret");

let checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, SECRET_TOKEN, (err, decoded) => {
      if (err) {
        return res
          .json({
            message: "Silahkan masuk terlebih dahulu",
          })
          .status(401);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res
      .json({
        message: "Silahkan masuk terlebih dahulu",
      })
      .status(401);
  }
};

module.exports = checkToken;
