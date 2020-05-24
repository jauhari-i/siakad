module.exports = deleteLaporan = async (conn, id, cb) => {
  await conn.query('DELETE FROM tbl_lapor WHERE id_lapor = ?', id, async (err, deleted) => {
    err
      ? await cb(err)
      : await cb(null, { status: 200, data: deleted, msg: 'Laporan berhasil dihapus' });
  });
};
