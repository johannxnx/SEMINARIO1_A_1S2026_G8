const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

router.get("/:id_usuario", notificationController.getNotifications);

module.exports = router;