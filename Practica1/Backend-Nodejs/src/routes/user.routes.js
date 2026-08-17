// Importar framework Express para crear rutas
const express = require("express");
// Crear instancia del router de Express
const router = express.Router();

// Importar middleware de Multer para carga de archivos
const upload = require("../middlewares/upload.middleware");
// Importar controlador de usuarios
const userController = require("../controllers/user.controller");

/**
 * PUT /profile
 * Endpoint para actualizar el perfil de un usuario
 * Body: { correo, nombre_completo, password (opcional) }
 * File: foto (opcional) - Nueva foto de perfil del usuario
 * Response: { success: boolean, message: string }
 */
router.put(
    "/profile",
    upload.single("foto"),  // Middleware para procesar archivo de foto
    userController.updateProfile  // Controlador que maneja la actualización
);

// Exportar el router para usarlo en la aplicación principal
module.exports = router;