// kurang absen

const _getIdKelas = async (conn, nik, cb) => {
  await conn.query("SELECT kelas FROM tbl_guru WHERE nik = ?", nik, (err, id) => {
    if (err) {
      cb(err);
    } else if (id.length > 0) {
      if (id[0].kelas !== 0) {
        cb(null, id[0].kelas);
      } else {
        cb({
          status: 200,
          msg: "Bukan Wali Kelas",
        });
      }
    } else {
      cb({
        status: 404,
        msg: "Tidak ditemukan",
      });
    }
  });
};

const _getSiswaKelas = async (conn, id, cb) => {
  await conn.query(
    "SELECT * FROM tbl_siswa INNER JOIN tbl_profil ON tbl_siswa.profil_siswa=tbl_profil.id_profil INNER JOIN tbl_kelas ON tbl_siswa.kelas=tbl_kelas.id_kelas INNER JOIN tbl_jurusan ON tbl_kelas.jurusan=tbl_jurusan.id_jurusan INNER JOIN tbl_tingkat ON tbl_kelas.tingkat=tbl_tingkat.id_tingkat WHERE tbl_siswa.kelas = ?",
    id,
    (err, siswa) => {
      if (err) {
        cb(err);
      } else if (siswa.length > 0) {
        let jumlah_siswa = siswa.length;
        let siswaData = siswa.map((s) => ({
          nama_siswa: s.nama,
          nis: s.nis,
          nisn: s.nisn,
          alamat: s.alamat,
          email: s.email,
          kelas: {
            nama_kelas: s.nama_kelas,
            jurusan: s.nama_jurusan,
            tingkat: s.tingkat,
          },
          foto: s.foto,
          absen: "soon",
        }));
        cb(null, {
          status: 200,
          data: {
            jumlah_siswa: jumlah_siswa,
            siswa: siswaData,
          },
        });
      } else {
        cb(null, {
          status: 200,
          data: null,
          msg: "Kelas kosong",
        });
      }
    }
  );
};

const _read = async (conn, nik, cb) => {
  await _getIdKelas(conn, nik, (err, id) => {
    if (err) {
      cb(err);
    } else {
      _getSiswaKelas(conn, id, (err, siswa) => {
        if (err) {
          cb(err);
        } else {
          cb(null, siswa);
        }
      });
    }
  });
};

module.exports = readAnakWali = async (conn, nik, cb) => {
  await _read(conn, nik, (err, result) => {
    if (err) {
      cb(err);
    } else {
      cb(null, result);
    }
  });
};
