const movieRepository = require("../repositories/movie.repository");

async function listMovies() {
  return await movieRepository.getAllMovies();
}

module.exports = {
  listMovies
};