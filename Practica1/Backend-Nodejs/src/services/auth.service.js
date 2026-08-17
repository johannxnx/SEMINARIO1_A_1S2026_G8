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

// Sube un archivo a S3 y devuelve la key (ruta) del objeto
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

// Recibe (data, file) — file es req.file de Multer (puede ser undefined)
exports.register = async (data, file) => {

    const { correo, nombre_completo, password, confirm_password } = data;

    if (!correo || !nombre_completo || !password || !confirm_password) {
        throw new Error("Todos los campos son obligatorios");
    }

    if (!validarCorreo(correo)) {
        throw new Error("Formato de correo inválido");
    }

    if (password !== confirm_password) {
        throw new Error("Las contraseñas no coinciden");
    }

    const existing = await userRepository.findByEmail(correo);
    if (existing) {
        throw new Error("El correo ya está registrado");
    }

    const hashedPassword = hashPassword(password);

    // Si llegó un archivo, subirlo a S3 y guardar la key
    const fotoKey = file ? await uploadFileToS3(file) : null;

    await userRepository.create(
        correo,
        nombre_completo,
        hashedPassword,
        fotoKey
    );

    return {
        success: true,
        message: "Usuario registrado correctamente"
    };
};

exports.login = async (data) => {

    const { correo, password } = data;

    if (!correo || !password) {
        throw new Error("Correo y contraseña son obligatorios");
    }

    if (!validarCorreo(correo)) {
        throw new Error("Formato de correo inválido");
    }

    const hashedPassword = hashPassword(password);
    const user = await userRepository.findByEmail(correo);

    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    if (user.password !== hashedPassword) {
        throw new Error("Contraseña incorrecta");
    }

    const baseUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    const fotoUrl = user.foto_perfil ? `${baseUrl}/${user.foto_perfil}` : null;

    return {
        success: true,
        message: "Login exitoso",
        user: {
            id_usuario: user.id_usuario,
            correo: user.correo,
            nombre_completo: user.nombre_completo,
            foto_perfil: fotoUrl
        }
    };
};