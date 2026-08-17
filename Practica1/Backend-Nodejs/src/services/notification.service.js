const notificationRepository = require("../repositories/notification.repository");

function formatTimeAgo(date) {
  const diff = Math.floor((new Date() - new Date(date)) / 1000);

  if (diff < 60) return "Hace unos segundos";
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
  return `Hace ${Math.floor(diff / 86400)} días`;
}

async function listNotifications(id_usuario) {
  const notifications = await notificationRepository.getNotificationsByUser(id_usuario);

  return notifications.map(n => ({
    id_notificacion: n.id_notificacion,
    mensaje: n.mensaje,
    leida: n.leida,
    fecha: n.fecha,
    fecha_formateada: formatTimeAgo(n.fecha)
  }));
}

module.exports = {
  listNotifications
};