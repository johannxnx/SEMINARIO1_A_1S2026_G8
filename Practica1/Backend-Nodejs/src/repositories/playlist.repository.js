const pool = require("../config/db");

async function findMovieById(id_pelicula) {
  const result = await pool.query(
    "SELECT * FROM peliculas WHERE id_pelicula = $1",
    [id_pelicula]
  );
  return result.rows[0];
}

async function addToPlaylist(id_usuario, id_pelicula) {
  const result = await pool.query(
    `
    INSERT INTO lista_reproduccion (id_usuario, id_pelicula)
    VALUES ($1, $2)
    RETURNING *
    `,
    [id_usuario, id_pelicula]
  );
  return result.rows[0];
}

async function getUserPlaylist(id_usuario) {
  const result = await pool.query(
    `
    SELECT p.*
    FROM lista_reproduccion lr
    JOIN peliculas p ON lr.id_pelicula = p.id_pelicula
    WHERE lr.id_usuario = $1
    ORDER BY lr.fecha_agregado DESC
    `,
    [id_usuario]
  );
  return result.rows;
}

async function removeFromPlaylist(id_usuario, id_pelicula) {
  await pool.query(
    `
    DELETE FROM lista_reproduccion
    WHERE id_usuario = $1 AND id_pelicula = $2
    `,
    [id_usuario, id_pelicula]
  );
}

module.exports = {
  findMovieById,
  addToPlaylist,
  getUserPlaylist,
  removeFromPlaylist
};