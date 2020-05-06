const absenGuru = require("./absenGuru")

_getKelas = (conn, id, cb) => {
  conn.query(
    "SELECT * FROM tbl_kelas INNER JOIN tbl_jurusan ON tbl_kelas.jurusan=tbl_jurusan.id_jurusan INNER JOIN tbl_tingkat ON tbl_kelas.tingkat=tbl_tingkat.id_tingkat WHERE id_kelas = ? ",
    id,
    (err, kelas) => {
      if (err) {
        cb(err);
      } else {
        let kelasData = kelas.map((k) => ({
          nama_kelas: k.nama_kelas,
          jurusan: k.nama_jurusan,
          tingkat: k.tingkat,
        }));
        cb(null, kelasData);
      }
    }
  );
};

_getJumlahSiswa = (conn, kelas, cb) => {
  conn.query("SELECT * FROM tbl_siswa WHERE kelas = ?", kelas, (err, siswa) => {
    if (err) {
      cb(err);
    } else {
      cb(null, siswa.length);
    }
  });
};

module.exports = readOwnData = async (conn, nik, cb) => {
  await conn.query("SELECT * FROM tbl_guru WHERE nik = ?", nik, (err, guru) => {
    if (err) {
      cb(err);
    } else if (guru.length > 0) {
      if (guru[0].kelas !== 0) {
        _getKelas(conn, guru[0].kelas, (err, result) => {
          if (err) {
            cb(err);
          } else {
            _getJumlahSiswa(conn, guru[0].kelas, (err, jumlah) => {
              if (err) {
                cb(err);
              } else {
                absenGuru.cekAbsen(conn,nik,(err,absen) => {
                  if(err){
                    cb(err)
                  }else{
                    let guruData = guru.map((g) => ({
                      nama: g.nama,
                      nik: g.nik,
                      email: g.email,
                      wali_kelas: result[0],
                      jumlah_siswa: jumlah,
                      absensi: absen
                    }));
                    cb(null, {
                      status: 200,
                      data: guruData,
                    });
                  }
                })
              }
            });
          }
        });
      } else {
        absenGuru.cekAbsen(conn,nik,(err,absen) => {
          if(err){
            cb(err)
          }else{
            let guruData = guru.map((g) => ({
              nama: g.nama,
              nik: g.nik,
              email: g.email,
              wali_kelas: "Tidak menjadi wali dari kelas apapun",
              absensi: absen
            }));
            cb(null, {
              status: 200,
              data: guruData,
            });
          }
        })
      }
    } else {
      cb({
        status: 404,
        msg: "Data tidak ditemukan",
      });
    }
  });
};
