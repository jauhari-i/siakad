const path = require("path");

const _createGuru = require("../service/guru/createGuru");
const _createGuruWithImages = require("../service/guru/createGuruWithImage");
const _updatePass = require("../service/guru/updateGuruPass");
const _updateGuruData = require("../service/guru/updateGuruData");
const _updateGuruDataWithImages = require("../service/guru/updateGuruDataWithImage");
const _readOwnData = require("../service/guru/readOwnData");
const _readGuruImages = require("../service/guru/readOwnImage");
const _readAnakWali = require("../service/guru/readAnakWali");
const _readAllGuru = require("../service/guru/readAll")
const _deleteGuru = require("../service/guru/deleteGuru");
const _absenGuruService = require("../service/guru/absenGuru");
const _absenSiswaWali = require("../service/guru/absenAnakWali");


const controller = {
  createGuru: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        res.send(err);
      } else {
        let data = req.body;
        let file = req.file;
        if (file) {
          _createGuruWithImages(conn, data, file, (err, result) => {
            if (err) {
              res.json(err);
            } else {
              res.json(result);
            }
          });
        } else {
          _createGuru(conn, data, (err, result) => {
            if (err) {
              res.json(err);
            } else {
              res.json(result);
            }
          });
        }
      }
    });
  },
  updatePass: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        res.send(err);
      } else {
        let data = req.body;
        let nik = req.decoded.nik;
        _updatePass(conn, data, nik, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        });
      }
    });
  },
  updateGuruData: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        res.send(err);
      } else {
        let data = req.body;
        let file = req.file;
        let nik = req.decoded.nik;
        if (file) {
          _updateGuruDataWithImages(conn, data, nik, file, (err, result) => {
            if (err) {
              res.json(err);
            } else {
              res.json(result);
            }
          });
        } else {
          _updateGuruData(conn, data, nik, (err, result) => {
            if (err) {
              res.json(err);
            } else {
              res.json(result);
            }
          });
        }
      }
    });
  },
  readOwnData: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        res.send(err);
      } else {
        let nik = req.decoded.nik;
        _readOwnData(conn, nik, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        });
      }
    });
  },
  readOwnImage: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        res.send(err);
      } else {
        let nik = req.decoded.nik;
        _readGuruImages(conn, nik, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.sendFile(path.join(__dirname, "../public/img", result));
          }
        });
      }
    });
  },
  deleteGuru: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        res.send(err);
      } else {
        let nik = req.params.nik;
        _deleteGuru(conn, nik, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        });
      }
    });
  },
  absenGuru: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        res.send(err);
      } else {
        let nik = req.decoded.nik;
        _absenGuruService.absenGuru(conn, nik, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        });
      }
    });
  },
  cekAbsen: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        res.send(err);
      } else {
        let nik = req.decoded.nik;
        _absenGuruService.cekAbsen(conn, nik, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        });
      }
    });
  },
  readAnakWali: (req, res) => {
    req.getConnection((err, conn) => {
      if (err) {
        res.send(err);
      } else {
        let nik = req.decoded.nik;
        _readAnakWali(conn, nik, (err, result) => {
          if (err) {
            res.json(err);
          } else {
            res.json(result);
          }
        });
      }
    });
  },
  absenAnakWali: (req, res) => {
    req.getConnection(async (err, conn) => {
      if (err) {
        res.send(err);
      } else {
        let nik = req.decoded.nik;
        let id_siswa = req.params.id;
        if (req.file) {
          let data = {
            status: req.params.status,
            file: req.file.filename,
          };
          await _absenSiswaWali(conn, id_siswa, nik, data, (err, result) => {
            if (err) {
              res.json(err);
            } else {
              res.json(result);
            }
          });
        } else {
          let data = {
            status: req.params.status,
          };
          await _absenSiswaWali(conn, id_siswa, nik, data, (err, result) => {
            if (err) {
              res.json(err);
            } else {
              res.json(result);
            }
          });
        }
      }
    });
  },
  readAllGuru: (req,res) => {
    req.getConnection( async (err,conn) => {
      if(err){
        res.send(err)
      }else{
        await _readAllGuru(conn,(err,result) => {
          if(err){
            res.json(err)
          }else{
            res.json(result)
          }
        })
      }
    })
  }
};

module.exports = controller;
