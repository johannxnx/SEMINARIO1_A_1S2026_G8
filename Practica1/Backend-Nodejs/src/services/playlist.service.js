const playlistRepository = require("../repositories/playlist.repository");
const notificationRepository = require("../repositories/notification.repository");

async function addMovieToPlaylist(id_usuario, id_pelicula) {
  const movie = await playlistRepository.findMovieById(id_pelicula);

  if (!movie) {
    throw new Error("Película no existe");
  }

  if (movie.estado !== "Disponible") {
    throw new Error("La película no está disponible");
  }

  try {
    const result = await playlistRepository.addToPlaylist(id_usuario, id_pelicula);

    
    await notificationRepository.createNotification(
      id_usuario,
      "Película agregada a tu lista"
    );

    return result;

  } catch (error) {
    if (error.code === "23505") {
      throw new Error("La película ya está en tu lista");
    }
    throw error;
  }
}

async function listUserPlaylist(id_usuario) {
  return await playlistRepository.getUserPlaylist(id_usuario);
}

async function deleteFromPlaylist(id_usuario, id_pelicula) {
  await playlistRepository.removeFromPlaylist(id_usuario, id_pelicula);
}

module.exports = {
  addMovieToPlaylist,
  listUserPlaylist,
  deleteFromPlaylist
};