const express = require("express");
const router = express.Router();
const client = require('../db');

// Obtener todos los precios de foam
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM preciosfoam");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo precio de foam
router.post("/", async (req, res) => {
  const { medidas, precio, idfoam, ancho_rollo, largo_rollo } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO preciosfoam (medidas, precio, idfoam, ancho_rollo, largo_rollo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [medidas, precio, idfoam, ancho_rollo, largo_rollo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un precio de foam existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { medidas, precio, idfoam, ancho_rollo, largo_rollo } = req.body;
  try {
    const result = await client.query(
      "UPDATE preciosfoam SET medidas = $1, precio = $2, idfoam = $3, ancho_rollo = $4, largo_rollo = $5 WHERE id = $6 RETURNING *",
      [medidas, precio, idfoam, ancho_rollo, largo_rollo, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Foam price not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un precio de foam
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM preciosfoam WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Foam price not found" });
    }
    res.json({ message: "Foam price deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;