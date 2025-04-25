const express = require("express");
const router = express.Router();
const client = require('../../../db');

// Obtener todos los derivados
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM Derivatives");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo derivado
router.post("/", async (req, res) => {
  const { name, materialid } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO Derivatives (name, materialid) VALUES ($1, $2) RETURNING *",
      [name, materialid]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un derivado existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, materialid } = req.body;
  try {
    const result = await client.query(
      "UPDATE Derivatives SET name = $1, materialid = $2 WHERE derivativeid = $3 RETURNING *",
      [name, materialid, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Derivative not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un derivado
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM Derivatives WHERE derivativeid = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Derivative not found" });
    }
    res.json({ message: "Derivative deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;