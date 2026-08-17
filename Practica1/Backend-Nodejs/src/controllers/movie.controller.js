const movieService = require("../services/movie.service");
const { formatTimeAgo } = require("../utils/time");

async function getMovies(req, res, next) {
  try {
    const movies = await movieService.listMovies();

    const bucket = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;

    const baseUrl = `https://${bucket}.s3.${region}.amazonaws.com`;

    const data = movies.map(m => ({
      id_pelicula: m.id_pelicula,
      titulo: m.titulo,
      director: m.director,
      anio_estreno: m.anio_estreno,
      poster_url: `${baseUrl}/${m.poster}`,
      url_contenido: m.url_contenido,
      estado: m.estado,
      is_available: m.estado === "Disponible"
    }));

    res.json({
      success: true,
      total: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getMovies };