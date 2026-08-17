// Importar servicio de autenticación
const authService = require("../services/auth.service");

// Controlador para registrar un nuevo usuario
exports.register = async (req, res) => {
    try {
        // Llamar al servicio de registro con los datos y archivo
        const result = await authService.register(req.body, req.file);
        // Retornar respuesta exitosa
        res.status(200).json(result);
    } catch (error) {
        // Capturar errores y retornar respuesta de error
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Controlador para iniciar sesión
exports.login = async (req, res) => {
    try {
        // Llamar al servicio de login con los datos
        const result = await authService.login(req.body);
        // Retornar respuesta exitosa
        res.status(200).json(result);
    } catch (error) {
        // Capturar errores y retornar respuesta de error
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
