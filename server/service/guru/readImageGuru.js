module.exports = readImageGuru = async (conn,nik,cb) => {
    await conn.query("SELECT * FROM tbl_guru WHERE nik = ?", nik, (err, guru) => {
        if (err) {
            cb(err);
        } else if (guru.length > 0) {
            let guruData = guru.map((g) => ({
                img: g.foto,
            }));
            cb(null, guruData[0].img);
        } else {
            cb({
                status: 404,
                msg: "Gambar guru tidak ditemukan",
            });
        }
    });
}