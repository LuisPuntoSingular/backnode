const express = require("express");
const router = express.Router();
const pool = require('../../../db'); // Ensure the correct path to your database connection



// GET: Retrieve address and contact information by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT * 
            FROM employee_address_contact
            WHERE employee_id = $1
        `, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Address and contact information not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error retrieving address and contact information:", error);
        res.status(500).json({ error: "Error retrieving address and contact information" });
    }
});

// POST: Create new address and contact information
router.post("/", async (req, res) => {
    const { employee_id, postal_code, neighborhood, state, municipality, street_and_number, phone_number, email } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO employee_address_contact (employee_id, postal_code, neighborhood, state, municipality, street_and_number, phone_number, email)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [employee_id, postal_code, neighborhood, state, municipality, street_and_number, phone_number, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating address and contact information:", error);
        res.status(500).json({ error: "Error creating address and contact information" });
    }
});

// PUT: Update address and contact information by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { employee_id, postal_code, neighborhood, state, municipality, street_and_number, phone_number, email } = req.body;
    try {
        const result = await pool.query(
            `UPDATE employee_address_contact
             SET employee_id = $1, postal_code = $2, neighborhood = $3, state = $4, municipality = $5, street_and_number = $6, phone_number = $7, email = $8
             WHERE id = $9 RETURNING *`,
            [employee_id, postal_code, neighborhood, state, municipality, street_and_number, phone_number, email, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Address and contact information not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating address and contact information:", error);
        res.status(500).json({ error: "Error updating address and contact information" });
    }
});

// DELETE: Delete address and contact information by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM employee_address_contact WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Address and contact information not found" });
        }
        res.status(200).json({ message: "Address and contact information successfully deleted" });
    } catch (error) {
        console.error("Error deleting address and contact information:", error);
        res.status(500).json({ error: "Error deleting address and contact information" });
    }
});

module.exports = router;