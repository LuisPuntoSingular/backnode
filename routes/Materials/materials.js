const express = require("express");
const router = express.Router();
const client = require('../../db');

// Obtener todos los materiales
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM Materials");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo material
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO Materials (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un material existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await client.query(
      "UPDATE Materials SET name = $1 WHERE materialid = $2 RETURNING *",
      [name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Material not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un material
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM Materials WHERE materialid = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Material not found" });
    }
    res.json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;