const playlistService = require("../services/playlist.service");
const { formatTimeAgo } = require("../utils/time");

async function add(req, res, next) {
  try {
    const { id_usuario, id_pelicula } = req.body;

    const result = await playlistService.addMovieToPlaylist(
      id_usuario,
      id_pelicula
    );

    res.json({
      success: true,
      message: "Película agregada a tu lista 🎬",
      data: {
        id_pelicula,
        fecha_agregado: result.fecha_agregado
      }
    });

  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  try {
    const { id_usuario } = req.params;

    const playlist = await playlistService.listUserPlaylist(id_usuario);

    const bucket = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_REGION;

    const baseUrl = `https://${bucket}.s3.${region}.amazonaws.com`;

    const data = playlist.map(p => ({
      id_pelicula: p.id_pelicula,
      titulo: p.titulo,
      poster_url: `${baseUrl}/${p.poster}`,
      director: p.director,
      anio_estreno: p.anio_estreno,
      url_contenido: p.url_contenido,
      fecha_agregado: p.fecha_agregado,
      fecha_agregado_formateada: formatTimeAgo(p.fecha_agregado)
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


async function remove(req, res, next) {
  try {
    const { id_usuario, id_pelicula } = req.body;

    await playlistService.deleteFromPlaylist(id_usuario, id_pelicula);

    res.json({
      success: true,
      message: "Película eliminada de tu lista"
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  add,
  getUser,
  remove
};