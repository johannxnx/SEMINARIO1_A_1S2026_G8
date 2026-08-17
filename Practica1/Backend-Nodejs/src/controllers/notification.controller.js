const notificationService = require("../services/notification.service");

async function getNotifications(req, res, next) {
  try {
    const { id_usuario } = req.params;

    const notifications = await notificationService.listNotifications(id_usuario);

    res.json({
      success: true,
      unread_count: notifications.filter(n => !n.leida).length,
      total: notifications.length,
      data: notifications
    }); 

  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications
};