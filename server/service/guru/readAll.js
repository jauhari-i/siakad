const absenGuru = require("./absenGuru")

module.exports = readAllGuru = async (conn,cb) => {
    await conn.query("SELECT * FROM tbl_guru",(err,guru) => {
        if(err){
            cb(err)
        }else{
            let dataGuru = []
            guru.map((item,i) => {
                if(item.kelas !== 0){
                    conn.query(
                        "SELECT * FROM tbl_kelas INNER JOIN tbl_jurusan ON tbl_kelas.jurusan=tbl_jurusan.id_jurusan INNER JOIN tbl_tingkat ON tbl_kelas.tingkat=tbl_tingkat.id_tingkat WHERE id_kelas = ? ",
                        item.kelas,
                        (err, kelas) => {
                            if (err) {
                                cb(err);
                            } else {
                                let kelasData = kelas.map((k) => ({
                                    nama_kelas: k.nama_kelas,
                                    jurusan: k.nama_jurusan,
                                    tingkat: k.tingkat,
                                }));
                                conn.query("SELECT * FROM tbl_siswa WHERE kelas = ?", item.kelas, (err, siswa) => {
                                    if (err) {
                                        cb(err);
                                    } else {
                                        let jumlahSiswa = siswa.length
                                        absenGuru.cekAbsen(conn, item.nik,(err,absen) => {
                                            if(err){
                                                return cb(err)
                                            }else{
                                                dataGuru.push({
                                                    nama: item.nama,
                                                    nik: item.nik,
                                                    email: item.email,
                                                    wali_kelas: kelasData,
                                                    jumlah_siswa: jumlahSiswa,
                                                    absensi: absen,
                                                    img: item.img
                                                })
                                                if(dataGuru.length === guru.length){
                                                    return cb(null,dataGuru)
                                                }
                                            }
                                        })
                                    }
                                });
                            }
                        })
                }else{
                    absenGuru.cekAbsen(conn, item.nik,(err,absen) => {
                        if(err){
                            return cb(err)
                        }else{
                            dataGuru.push({
                                nama: item.nama,
                                nik: item.nik,
                                email: item.email,
                                wali_kelas: "Tidak menjadi wali dari kelas apapun",
                                absensi: absen,
                                img: item.img
                            })
                            if(dataGuru.length === guru.length){
                                return cb(null,dataGuru)
                            }
                        }
                    })
                }
            })
        }
    })
}