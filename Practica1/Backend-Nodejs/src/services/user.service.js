const crypto = require("crypto");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("../config/s3");
const userRepository = require("../repositories/user.repository");

function hashPassword(password) {
    return crypto.createHash("md5").update(password).digest("hex");
}

function validarCorreo(correo) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
}

async function uploadFileToS3(file) {
    const cleanName = file.originalname.replace(/\s+/g, "_");
    const key = `Fotos_Perfil/${Date.now()}_${cleanName}`;

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        })
    );

    return key;
}

// ==============================
// UPDATE PROFILE
// ==============================

// Recibe (data, file) — file es req.file de Multer (puede ser undefined)
exports.updateProfile = async (data, file) => {

    const { id_usuario, nombre_completo, password_actual } = data;

    if (!id_usuario || !password_actual) {
        throw new Error("Datos incompletos");
    }

    const user = await userRepository.findById(id_usuario);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    const hashed = hashPassword(password_actual);

    if (user.password !== hashed) {
        throw new Error("Contraseña actual incorrecta");
    }

    // Si llegó un archivo nuevo, subirlo a S3; si no, conservar la foto actual
    const fotoKey = file ? await uploadFileToS3(file) : user.foto_perfil;

    await userRepository.updateProfile(
        id_usuario,
        nombre_completo || user.nombre_completo,
        fotoKey
    );

    return {
        success: true,
        message: "Perfil actualizado correctamente"
    };
};