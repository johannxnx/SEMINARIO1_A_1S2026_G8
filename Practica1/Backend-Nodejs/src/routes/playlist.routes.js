const express = require("express");
const router = express.Router();
const playlistController = require("../controllers/playlist.controller");

router.post("/", playlistController.add);
router.get("/:id_usuario", playlistController.getUser);
router.delete("/", playlistController.remove);

module.exports = router;