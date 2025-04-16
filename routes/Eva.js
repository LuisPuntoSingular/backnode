const express = require("express");
const router = express.Router();
const client = require('../db');

// Obtener todas las entradas de EVA
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM Eva");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva entrada de EVA
router.post("/", async (req, res) => {
  const { medida, precio } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO Eva (medida, precio) VALUES ($1, $2) RETURNING *",
      [medida, precio]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una entrada de EVA existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { medida, precio } = req.body;
  try {
    const result = await client.query(
      "UPDATE Eva SET medida = $1, precio = $2 WHERE id = $3 RETURNING *",
      [medida, precio, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "EVA entry not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una entrada de EVA
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM Eva WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "EVA entry not found" });
    }
    res.json({ message: "EVA entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;