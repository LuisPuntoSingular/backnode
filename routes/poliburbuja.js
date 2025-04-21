const express = require("express");
const router = express.Router();
const client = require('../db');

// Obtener todos los derivados de Poliburbuja
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM Poliburbuja");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo derivado de Poliburbuja
router.post("/", async (req, res) => {
  const { derivados } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO Poliburbuja (derivados) VALUES ($1) RETURNING *",
      [derivados]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un derivado de Poliburbuja existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { derivados } = req.body;
  try {
    const result = await client.query(
      "UPDATE Poliburbuja SET derivados = $1 WHERE id = $2 RETURNING *",
      [derivados, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Poliburbuja entry not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un derivado de Poliburbuja
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM Poliburbuja WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Poliburbuja entry not found" });
    }
    res.json({ message: "Poliburbuja entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
"a".
module.exports = router;