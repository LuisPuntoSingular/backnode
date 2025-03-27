const express = require("express");
const client = require('../db');
const router = express.Router();
// controllers/cotizadorController.js



router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM ResistanceCategories");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
