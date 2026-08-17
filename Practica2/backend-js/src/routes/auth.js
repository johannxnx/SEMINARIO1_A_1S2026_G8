const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const pool = require('../config/db');
const s3 = require('../config/s3');
require('dotenv').config();

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/auth/register
router.post('/register', upload.single('profile_pic'), async (req, res) => {
  const { username, email, password, confirm_password } = req.body;

  if (!username || !email || !password || !confirm_password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  if (password !== confirm_password) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  }

  try {
    const exists = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Usuario o email ya registrado' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    let profile_pic = null;
    if (req.file) {
      const key = `profiles/${Date.now()}_${req.file.originalname}`;
      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_FILES,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      }));
      profile_pic = `https://${process.env.S3_BUCKET_FILES}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    }

    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, profile_pic) VALUES ($1, $2, $3, $4) RETURNING id, username, email, profile_pic',
      [username, email, password_hash, profile_pic]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile_pic: user.profile_pic
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, profile_pic, created_at FROM users WHERE id = $1',
      [req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;