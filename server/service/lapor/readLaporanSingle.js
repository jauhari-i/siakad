module.exports = readLaporanSingle = async (conn, id, cb) => {
  await conn.query(
    'SELECT * FROM tbl_lapor INNER JOIN tbl_kelas ON tbl_lapor.id_kelas = tbl_kelas.id_kelas WHERE id_lapor = ?',
    id,
    async (err, data) => {
      if (err) {
        await cb(err);
      } else {
        if (data.length > 0) {
          let dataNew = await data.map((d) => ({
            pelapor: d.pelapor,
            keterangan: d.keterangan,
            kelas: d.nama_kelas,
            status:
              d.status === 0
                ? { code: 0, msg: 'Menunggu Konfirmasi' }
                : d.status === 1
                ? { code: 1, msg: 'Sedang Diperbaiki' }
                : { code: d.status, msg: 'Selesai' },
            tgl: d.created_at,
          }));
          await cb(null, {
            status: 200,
            data: dataNew,
          });
        } else {
          await cb(null, {
            data: 'Tidak ada data laporan',
          });
        }
      }
    }
  );
};
