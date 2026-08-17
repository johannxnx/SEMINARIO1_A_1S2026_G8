const API_BASE_URL = "http://localhost:3000/api";

export const addToPlaylist = async (id_usuario, id_pelicula) => {
  const response = await fetch(`${API_BASE_URL}/playlist/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario, id_pelicula })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al agregar a la lista");
  }

  return data;
};

// OBTENER PLAYLIST
export const getUserPlaylist = async (id_usuario) => {
  const response = await fetch(`${API_BASE_URL}/playlist/${id_usuario}`);

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al obtener playlist");
  }

  return data.data;
};

// ELIMINAR
export const removeFromPlaylist = async (id_usuario, id_pelicula) => {
  const response = await fetch(`${API_BASE_URL}/playlist/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_usuario, id_pelicula })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al eliminar");
  }

  return data;
};