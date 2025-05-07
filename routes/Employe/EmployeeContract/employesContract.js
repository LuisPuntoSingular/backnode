const express = require("express");
const router = express.Router();
const client = require('../../../db');

// Obtener un contrato de empleado por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query(
      `SELECT * FROM employee_document_contracts WHERE employee_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Contract not found for the given employee ID" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un contrato de empleado
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    contract1_signature_date,
    contract2_signature_date,
    contract3_signature_date,
    permanent_signature_date
  } = req.body;

  try {
    const result = await client.query(
      `UPDATE employee_document_contracts
       SET 
         contract1_signature_date = COALESCE($1, contract1_signature_date),
         contract2_signature_date = COALESCE($2, contract2_signature_date),
         contract3_signature_date = COALESCE($3, contract3_signature_date),
         permanent_signature_date = COALESCE($4, permanent_signature_date),
         updated_at = NOW()
       WHERE employee_id = $5
       RETURNING *`,
      [
        contract1_signature_date,
        contract2_signature_date,
        contract3_signature_date,
        permanent_signature_date,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Contract not found for the given employee ID" });
    }

    res.status(200).json({ message: "Contract updated successfully", contract: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;