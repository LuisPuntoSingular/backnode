const express = require('express');
const router = express.Router();
const db = require('../../db');

// Obtener todos los días festivos
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM holidays ORDER BY holiday_date');
  res.json(result.rows);
});

// Obtener uno por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM holidays WHERE id = $1', [id]);
  res.json(result.rows[0]);
});

// Crear nuevo festivo
router.post('/', async (req, res) => {
  const { holiday_date, name, is_paid } = req.body;
  const result = await db.query(`
    INSERT INTO holidays (holiday_date, name, is_paid)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [holiday_date, name, is_paid]);

  res.status(201).json(result.rows[0]);
});

// Editar festivo
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { holiday_date, name, is_paid } = req.body;
  const result = await db.query(`
    UPDATE holidays
    SET holiday_date = $1, name = $2, is_paid = $3
    WHERE id = $4
    RETURNING *
  `, [holiday_date, name, is_paid, id]);

  res.json(result.rows[0]);
});

// Eliminar festivo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM holidays WHERE id = $1', [id]);
  res.status(204).send();
});

module.exports = router;
