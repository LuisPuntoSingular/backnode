const express = require("express");
const router = express.Router();
const client = require('../db');

// Obtener todas las entradas de Poliburbuja
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM Poliburbuja");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva entrada de Poliburbuja
router.post("/", async (req, res) => {
  const { medidas, precio, idpoliburbuja, ancho_rollo, largo_rollo } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO Poliburbuja (medidas, precio, idpoliburbuja, ancho_rollo, largo_rollo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [medidas, precio, idpoliburbuja, ancho_rollo, largo_rollo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una entrada de Poliburbuja existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { medidas, precio, idpoliburbuja, ancho_rollo, largo_rollo } = req.body;
  try {
    const result = await client.query(
      "UPDATE Poliburbuja SET medidas = $1, precio = $2, idpoliburbuja = $3, ancho_rollo = $4, largo_rollo = $5 WHERE id = $6 RETURNING *",
      [medidas, precio, idpoliburbuja, ancho_rollo, largo_rollo, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Poliburbuja entry not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una entrada de Poliburbuja
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

module.exports = router;