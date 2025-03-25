// controllers/cotizadorController.js
const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// controllers/cotizadorController.js

const getMateriales = async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM materiales");
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener materiales" });
    }
  };
  
  const getResistencias = async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM resistencias");
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener resistencias" });
    }
  };
  
  
  
// Exportar la función
module.exports = { getMateriales, getResistencias };
