const express = require("express");
const client = require('../../../db');

const router = express.Router();

// Obtener todas las resistencias
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM Resistances");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una nueva resistencia
router.post("/", async (req, res) => {
  const { ect, flute, resistances, pricem2, minimum, trim, categoryid } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO Resistances (ect, flute, resistances, pricem2, minimum, trim, categoryid) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [ect, flute, resistances, pricem2, minimum, trim, categoryid]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar una resistencia existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ect, flute, resistances, pricem2, minimum, trim, categoryid } = req.body;
  try {
    const result = await client.query(
      "UPDATE Resistances SET ect = $1, flute = $2, resistances = $3, pricem2 = $4, minimum = $5, trim = $6, categoryid = $7 WHERE resistanceid = $8 RETURNING *",
      [ect, flute, resistances, pricem2, minimum, trim, categoryid, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Resistance not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar una resistencia
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      "DELETE FROM Resistances WHERE resistanceid = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Resistance not found" });
    }
    res.json({ message: "Resistance deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;