const express = require("express");
const router = express.Router();
const client = require('../db');

// Obtener todos los colores de Foam
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM ColoresFoam");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo color de Foam
router.post("/", async (req, res) => {
  const { color, anchoplaca, largoplaca } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO ColoresFoam (color, anchoplaca, largoplaca) VALUES ($1, $2, $3) RETURNING *",
      [color, anchoplaca, largoplaca]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un color de Foam existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { color, anchoplaca, largoplaca } = req.body;
  try {
    const result = await client.query(
      "UPDATE ColoresFoam SET color = $1, anchoplaca = $2, largoplaca = $3 WHERE id = $4 RETURNING *",
      [color, anchoplaca, largoplaca, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Foam color not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un color de Foam
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM ColoresFoam WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Foam color not found" });
    }
    res.json({ message: "Foam color deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;