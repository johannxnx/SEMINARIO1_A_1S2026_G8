const API_BASE_URL = "http://localhost:3000/api";

// Obtener todas las películas
export const getMovies = async () => {
  const response = await fetch(`${API_BASE_URL}/movies/`);

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al obtener películas");
  }

  return data.data; // solo regresamos el arreglo
};