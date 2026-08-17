const pool = require("../config/db.js");

exports.findById = async (id_usuario) => {
    const result = await pool.query(
        "SELECT * FROM usuarios WHERE id_usuario = $1",
        [id_usuario]
    );
    return result.rows[0];
};

exports.updateProfile = async (id_usuario, nombre, foto) => {
    await pool.query(
        `UPDATE usuarios
         SET nombre_completo = $1,
             foto_perfil = $2
         WHERE id_usuario = $3`,
        [nombre, foto, id_usuario]
    );
};

exports.findByEmail = async (correo) => {
    const result = await pool.query(
        "SELECT * FROM usuarios WHERE correo = $1",
        [correo]
    );
    return result.rows[0];
};

exports.create = async (correo, nombre_completo, password, foto_perfil) => {
    const result = await pool.query(
        `INSERT INTO usuarios (correo, nombre_completo, password, foto_perfil)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [correo, nombre_completo, password, foto_perfil]
    );
    return result.rows[0];
};