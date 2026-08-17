const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes  = require('./src/routes/auth');
const tasksRoutes = require('./src/routes/tasks');
const filesRoutes = require('./src/routes/files');

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', server: 'Node.js', timestamp: new Date() });
});

// Rutas
app.use('/api/auth',  authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/files', filesRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Servidor Node.js corriendo en puerto ${PORT}`);
});