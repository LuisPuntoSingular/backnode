const express = require("express");
const router = express.Router();
const pool = require('../../../db'); // Asegúrate de que la ruta sea correcta

// GET: Retrieve all plants
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM plants");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error retrieving plants:", error);
        res.status(500).json({ error: "Error retrieving plants" });
    }
});

// GET: Retrieve a plant by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT * FROM plants WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Plant not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error retrieving plant:", error);
        res.status(500).json({ error: "Error retrieving plant" });
    }
});

// POST: Create a new plant
router.post("/", async (req, res) => {
    const { plant_name } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO plants (plant_name) VALUES ($1) RETURNING *`,
            [plant_name]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating plant:", error);
        res.status(500).json({ error: "Error creating plant" });
    }
});

// PUT: Update a plant by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { plant_name } = req.body;
    try {
        const result = await pool.query(
            `UPDATE plants SET plant_name = $1 WHERE id = $2 RETURNING *`,
            [plant_name, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Plant not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating plant:", error);
        res.status(500).json({ error: "Error updating plant" });
    }
});

// DELETE: Delete a plant by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM plants WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Plant not found" });
        }
        res.status(200).json({ message: "Plant successfully deleted" });
    } catch (error) {
        console.error("Error deleting plant:", error);
        res.status(500).json({ error: "Error deleting plant" });
    }
});

module.exports = router;