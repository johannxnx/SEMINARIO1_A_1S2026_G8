const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// GET /api/tasks — obtener todas las tareas del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// POST /api/tasks — crear tarea
router.post('/', authMiddleware, async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'El título es requerido' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, title, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// PUT /api/tasks/:id — editar tarea
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description)
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [title, description, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al editar tarea' });
  }
});

// PATCH /api/tasks/:id/complete — marcar como completada
router.patch('/:id/complete', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `UPDATE tasks SET completed = NOT completed
       WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});

// DELETE /api/tasks/:id — eliminar tarea
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

module.exports = router;