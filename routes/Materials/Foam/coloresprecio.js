const express = require("express");
const router = express.Router();
const client = require('../../../db');

// Obtener todos los precios de colores
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM ColoresPrecio");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo precio de colores
router.post("/", async (req, res) => {
  const { medida, precio, idcoloresfoam } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO ColoresPrecio (medida, precio, idcoloresfoam) VALUES ($1, $2, $3) RETURNING *",
      [medida, precio, idcoloresfoam]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un precio de colores existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { medida, precio, idcoloresfoam } = req.body;
  try {
    const result = await client.query(
      "UPDATE ColoresPrecio SET medida = $1, precio = $2, idcoloresfoam = $3 WHERE id = $4 RETURNING *",
      [medida, precio, idcoloresfoam, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Color price not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un precio de colores
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM ColoresPrecio WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Color price not found" });
    }
    res.json({ message: "Color price deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;