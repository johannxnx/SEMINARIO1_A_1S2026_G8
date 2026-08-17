const API_BASE_URL = "http://localhost:3000/api";

// Iniciar sesión
export const loginUser = async (correo, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo, password }),
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al iniciar sesión");
  }
  return data;
};

// Registrar usuario (con foto)
export const registerUser = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    body: formData, // FormData para enviar la foto
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || "Error al registrarse");
  }
  return data;
};