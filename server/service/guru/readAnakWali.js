const date = require("../../constant/date");

const _getAbsenSiswa = async (conn, id, cb) => {
  await conn.query(
    "SELECT * FROM tbl_absen_siswa WHERE id_siswa = ?  AND tgl >= ? AND tgl < ?",
    [id, date.dateToday, date.dateTommorrow],
    (err, absenSiswa) => {
      if (err) {
        cb(err);
      } else if (absenSiswa.length > 0) {
        let siswa = absenSiswa[0];
        if (siswa.status === 1) {
          cb(null, {
            status: 200,
            msg: "Siswa sudah melakukan absensi hari ini",
            status_kehadiran: "Masuk",
            kehadiran_kode: 1,
          });
        } else if (siswa.status === 2) {
          cb(null, {
            status: 200,
            msg: "Siswa sakit hari ini",
            status_kehadiran: "Sakit",
            kehadiran_kode: 2,
          });
        } else if (siswa.status === 3) {
          cb(null, {
            status: 200,
            msg: "Siswa mendapatkan Izin",
            status_kehadiran: "Izin",
            kehadiran_kode: 3,
          });
        } else if (siswa.status === 4) {
          cb(null, {
            status: 200,
            msg: "Siswa mendapatkan Dispensasi",
            status_kehadiran: "Dispensasi",
            kehadiran_kode: 4,
          });
        } else {
          cb(null, {
            status: 200,
            msg: "Siswa tidak melakukan absensi hari ini",
            status_kehadiran: "Alpha",
            kehadiran_kode: 0,
          });
        }
      } else {
        cb(null, null, {
          status: "Belum Absen",
        });
      }
    }
  );
};

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
        let siswaData = [];
        siswa.map((s, i) => {
          _getAbsenSiswa(conn, s.id_siswa, (err, isAbsen, notAbsen) => {
            if (err) {
              return cb(err);
            } else if (isAbsen) {
              siswaData.push({
                id: s.id_siswa,
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
                absen: isAbsen,
              });
            } else if (notAbsen) {
              siswaData.push({
                id: s.id_siswa,
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
                absen: notAbsen,
              });
            } else {
              return null;
            }
            if (siswaData.length === jumlah_siswa) {
              return cb(null, {
                status: 200,
                data: {
                  jumlah_siswa: jumlah_siswa,
                  siswa: siswaData,
                },
              });
            }
          });
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
