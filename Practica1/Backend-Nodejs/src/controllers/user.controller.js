// Importar servicio de usuarios
const userService = require("../services/user.service");

// Controlador para actualizar el perfil de usuario
exports.updateProfile = async (req, res) => {
    try {
        // Llamar al servicio de actualización con los datos y archivo
        const result = await userService.updateProfile(req.body, req.file);
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