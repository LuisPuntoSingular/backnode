const express = require("express");
const router = express.Router();
const client = require('../db');

// Obtener todos los derivados de Foam
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM Foam");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo derivado de Foam
router.post("/", async (req, res) => {
  const { derivado } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO Foam (derivado) VALUES ($1) RETURNING *",
      [derivado]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un derivado de Foam existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { derivado } = req.body;
  try {
    const result = await client.query(
      "UPDATE Foam SET derivado = $1 WHERE id = $2 RETURNING *",
      [derivado, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Foam derivative not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un derivado de Foam
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM Foam WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Foam derivative not found" });
    }
    res.json({ message: "Foam derivative deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;