const express = require("express");
const router = express.Router();
const client = require('../db');

// controllers/poliburbujaController.js
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM Poliburbuja");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;