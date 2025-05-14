const express = require('express');
const router = express.Router();
const db = require('../../db');

// Obtener todos los códigos
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM attendance_codes ORDER BY code');
  res.json(result.rows);
});

// Obtener un código específico
router.get('/:code', async (req, res) => {
  const { code } = req.params;
  const result = await db.query('SELECT * FROM attendance_codes WHERE code = $1', [code]);
  res.json(result.rows[0]);
});

// Crear nuevo código
router.post('/', async (req, res) => {
  const { code, description } = req.body;
  const result = await db.query(`
    INSERT INTO attendance_codes (code, description)
    VALUES ($1, $2)
    RETURNING *
  `, [code, description]);

  res.status(201).json(result.rows[0]);
});

// Editar código
router.put('/:code', async (req, res) => {
  const { code } = req.params;
  const { description } = req.body;
  const result = await db.query(`
    UPDATE attendance_codes
    SET description = $1
    WHERE code = $2
    RETURNING *
  `, [description, code]);

  res.json(result.rows[0]);
});

// Eliminar código
router.delete('/:code', async (req, res) => {
  const { code } = req.params;
  await db.query('DELETE FROM attendance_codes WHERE code = $1', [code]);
  res.status(204).send();
});

module.exports = router;
