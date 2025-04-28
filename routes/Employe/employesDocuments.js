const express = require('express');
const router = express.Router();
const pool = require('../../db'); // Asegúrate de tener configurada tu conexión a la base de datos

// GET: Obtener todos los documentos de empleados
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM employee_documents WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Documento de empleado no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener los documentos del empleado:', error);
        res.status(500).json({ error: 'Error al obtener los documentos del empleado' });
    }
});

// PUT: Actualizar un documento de empleado por ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { birth_certificate, curp, proof_of_address, ine, rfc } = req.body;

    try {
        const result = await pool.query(
            `UPDATE employee_documents
             SET birth_certificate = $1, curp = $2, proof_of_address = $3, ine = $4, rfc = $5
             WHERE id = $6
             RETURNING *`,
            [birth_certificate, curp, proof_of_address, ine, rfc, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Documento de empleado no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar el documento de empleado:', error);
        res.status(500).json({ error: 'Error al actualizar el documento de empleado' });
    }
});

module.exports = router;