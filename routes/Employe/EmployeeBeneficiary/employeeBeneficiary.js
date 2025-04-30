const express = require("express");
const router = express.Router();
const pool = require('../../../db'); // Ensure the correct path to your database connection

// GET: Retrieve all employee beneficiaries
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT eb.*, e.name AS employee_name, e.last_name_paterno AS employee_last_name
            FROM employee_beneficiary eb
            INNER JOIN employees e ON eb.employee_id = e.id
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error retrieving beneficiaries:", error);
        res.status(500).json({ error: "Error retrieving beneficiaries" });
    }
});

// GET: Retrieve a beneficiary by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT eb.*, e.name AS employee_name, e.last_name_paterno AS employee_last_name
            FROM employee_beneficiary eb
            INNER JOIN employees e ON eb.employee_id = e.id
            WHERE eb.id = $1
        `, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Beneficiary not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error retrieving beneficiary:", error);
        res.status(500).json({ error: "Error retrieving beneficiary" });
    }
});

// POST: Create a new beneficiary
router.post("/", async (req, res) => {
    const { employee_id, first_name, last_name, birth_date, relationship, phone_number, percentage } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO employee_beneficiary (employee_id, first_name, last_name, birth_date, relationship, phone_number, percentage)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [employee_id, first_name, last_name, birth_date, relationship, phone_number, percentage]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating beneficiary:", error);
        res.status(500).json({ error: "Error creating beneficiary" });
    }
});

// PUT: Update a beneficiary by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { employee_id, first_name, last_name, birth_date, relationship, phone_number, percentage } = req.body;
    try {
        const result = await pool.query(
            `UPDATE employee_beneficiary
             SET employee_id = $1, first_name = $2, last_name = $3, birth_date = $4, relationship = $5, phone_number = $6, percentage = $7
             WHERE id = $8 RETURNING *`,
            [employee_id, first_name, last_name, birth_date, relationship, phone_number, percentage, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Beneficiary not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating beneficiary:", error);
        res.status(500).json({ error: "Error updating beneficiary" });
    }
});

// DELETE: Delete a beneficiary by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM employee_beneficiary WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Beneficiary not found" });
        }
        res.status(200).json({ message: "Beneficiary successfully deleted" });
    } catch (error) {
        console.error("Error deleting beneficiary:", error);
        res.status(500).json({ error: "Error deleting beneficiary" });
    }
});

module.exports = router;