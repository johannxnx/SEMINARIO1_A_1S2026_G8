require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testDB() {
  try {
    console.log("Intentando conectar a la base de datos...\n");

    const client = await pool.connect();

    const result = await client.query('SELECT NOW()');

    console.log("Conexión exitosa a PostgreSQL en RDS");
    console.log("Hora del servidor:", result.rows[0].now);

    client.release();
    process.exit(0);

  } catch (error) {
    console.error("Error de conexión:");
    console.error(error.message);
    process.exit(1);
  }
}

testDB();