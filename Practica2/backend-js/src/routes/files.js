const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const pool = require('../config/db');
const s3 = require('../config/s3');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

const upload = multer({ storage: multer.memoryStorage() });

// GET /api/files — listar archivos del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM files WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener archivos' });
  }
});

// POST /api/files/upload — subir archivo directamente
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Archivo requerido' });
  }

  try {
    const { originalname, mimetype, buffer, size } = req.file;
    const key = `files/${req.userId}/${Date.now()}_${originalname}`;

    let file_type = 'other';
    if (mimetype.startsWith('image/')) file_type = 'image';
    else if (mimetype.startsWith('text/')) file_type = 'text';

    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_FILES,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    }));

    const file_url = `https://${process.env.S3_BUCKET_FILES}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const result = await pool.query(
      'INSERT INTO files (user_id, filename, file_type, file_url, file_size) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.userId, originalname, file_type, file_url, size]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al subir archivo' });
  }
});

// POST /api/files/upload-url — guardar URL de archivo subido por Lambda
router.post('/upload-url', authMiddleware, async (req, res) => {
  const { filename, file_type, file_url, file_size } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO files (user_id, filename, file_type, file_url, file_size) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.userId, filename, file_type, file_url, file_size]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar archivo' });
  }
});

// DELETE /api/files/:id — eliminar archivo
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM files WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }

    res.json({ message: 'Archivo eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar archivo' });
  }
});

module.exports = router;