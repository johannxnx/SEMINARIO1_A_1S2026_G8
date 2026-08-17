const pool = require("../config/db");

async function getAllMovies() {
  const query = `
    SELECT 
      id_pelicula,
      titulo,
      director,
      anio_estreno,
      url_contenido,
      poster,
      estado
    FROM peliculas
    ORDER BY id_pelicula DESC
  `;

  const result = await pool.query(query);
  return result.rows;
}

module.exports = {
  getAllMovies
};