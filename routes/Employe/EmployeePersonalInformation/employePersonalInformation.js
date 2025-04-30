const express = require("express");
const router = express.Router();
const pool = require('../../../db'); // Ensure the correct path to your database connection




// GET: Retrieve personal information by ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT * 
            FROM employee_personal_information
            WHERE employee_id = $1
        `, [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Personal information not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error retrieving personal information:", error);
        res.status(500).json({ error: "Error retrieving personal information" });
    }
});

// POST: Create new personal information
router.post("/", async (req, res) => {
    const { employee_id, curp, rfc, gender, marital_status, birth_date, nss } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO employee_personal_information (employee_id, curp, rfc, gender, marital_status, birth_date, nss)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [employee_id, curp, rfc, gender, marital_status, birth_date, nss]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating personal information:", error);
        res.status(500).json({ error: "Error creating personal information" });
    }
});

// PUT: Update personal information by ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { employee_id, curp, rfc, gender, marital_status, birth_date, nss } = req.body;
    try {
        const result = await pool.query(
            `UPDATE employee_personal_information
             SET employee_id = $1, curp = $2, rfc = $3, gender = $4, marital_status = $5, birth_date = $6, nss = $7
             WHERE id = $8 RETURNING *`,
            [employee_id, curp, rfc, gender, marital_status, birth_date, nss, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Personal information not found" });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating personal information:", error);
        res.status(500).json({ error: "Error updating personal information" });
    }
});

// DELETE: Delete personal information by ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM employee_personal_information WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Personal information not found" });
        }
        res.status(200).json({ message: "Personal information successfully deleted" });
    } catch (error) {
        console.error("Error deleting personal information:", error);
        res.status(500).json({ error: "Error deleting personal information" });
    }
});

module.exports = router;