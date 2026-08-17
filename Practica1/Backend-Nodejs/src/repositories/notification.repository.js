const pool = require("../config/db");

async function createNotification(id_usuario, mensaje) {
  await pool.query(
    `
    INSERT INTO notificaciones (id_usuario, mensaje)
    VALUES ($1, $2)
    `,
    [id_usuario, mensaje]
  );
}

async function getNotificationsByUser(id_usuario) {
  const result = await pool.query(
    `
    SELECT id_notificacion, mensaje, leida, fecha
    FROM notificaciones
    WHERE id_usuario = $1
    ORDER BY fecha DESC
    `,
    [id_usuario]
  );
  return result.rows;
}

module.exports = {
  createNotification,
  getNotificationsByUser
};