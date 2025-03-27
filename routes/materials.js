const express = require("express");
const router = express.Router();
const client = require('../db');
// controllers/cotizadorController.js


router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM Materials");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
