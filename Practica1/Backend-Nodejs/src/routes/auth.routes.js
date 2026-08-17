// Importar framework Express para crear rutas
const express = require("express");
// Crear instancia del router de Express
const router = express.Router();

// Importar middleware de Multer para carga de archivos
const upload = require("../middlewares/upload.middleware");
// Importar controlador de autenticación
const authController = require("../controllers/auth.controller");

/**
 * POST /register
 * Endpoint para registrar un nuevo usuario en el sistema
 * Body: { correo, nombre_completo, password, confirm_password }
 * File: foto (opcional) - Foto de perfil del usuario
 * Response: { success: boolean, message: string }
 */
router.post(
    "/register",
    upload.single("foto"),  // Middleware para procesar archivo de foto
    authController.register  // Controlador que maneja el registro
);

/**
 * POST /login
 * Endpoint para iniciar sesión en el sistema
 * Body: { correo, password }
 * Response: { success: boolean, message: string, user: { id_usuario, correo, nombre_completo, foto_perfil } }
 */
router.post(
    "/login",
    authController.login  // Controlador que maneja el login
);

// Exportar el router para usarlo en la aplicación principal
module.exports = router;