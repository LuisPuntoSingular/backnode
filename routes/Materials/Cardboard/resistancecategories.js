const express = require("express");
const client = require('../../../db');
const router = express.Router();

// Obtener todas las categorías de resistencia
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM ResistanceCategories");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva categoría de resistencia
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO ResistanceCategories (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una categoría de resistencia existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await client.query(
      "UPDATE ResistanceCategories SET name = $1 WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Resistance category not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una categoría de resistencia
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM ResistanceCategories WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Resistance category not found" });
    }
    res.json({ message: "Resistance category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;