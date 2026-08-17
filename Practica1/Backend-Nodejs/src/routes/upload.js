import express from "express";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-profile", upload.single("foto"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No se envió ningún archivo"
      });
    }

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

    return res.json({
      success: true,
      path: key
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;