const express = require("express");
const router = express.Router();
const client = require('../db');

// Obtener todas las entradas de EPE
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM Epe");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva entrada de EPE
router.post("/", async (req, res) => {
  const { medidas, precio } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO Epe (medidas, precio) VALUES ($1, $2) RETURNING *",
      [medidas, precio]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una entrada de EPE existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { medidas, precio } = req.body;
  try {
    const result = await client.query(
      "UPDATE Epe SET medidas = $1, precio = $2 WHERE id = $3 RETURNING *",
      [medidas, precio, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "EPE entry not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una entrada de EPE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM Epe WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "EPE entry not found" });
    }
    res.json({ message: "EPE entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;