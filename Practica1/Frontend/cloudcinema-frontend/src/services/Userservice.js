const API_BASE_URL = "http://localhost:3000/api";

// Actualizar perfil (nombre + foto, requiere contraseña actual)
export const updateProfile = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "PUT",
    body: formData, // FormData para enviar la foto si aplica
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al actualizar el perfil");
  }
  return data;
};