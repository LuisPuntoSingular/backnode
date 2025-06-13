const express = require('express');
const router = express.Router();
const db = require('../../db');

// Obtener todas las semanas
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM work_weeks ORDER BY year, week_number');
  res.json(result.rows);
});

// Obtener una semana por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.query('SELECT * FROM work_weeks WHERE id = $1', [id]);
  res.json(result.rows[0]);
});

// Crear nueva semana
router.post('/', async (req, res) => {
  const { week_number, year, start_date, end_date } = req.body;
  const result = await db.query(`
    INSERT INTO work_weeks (week_number, year, start_date, end_date)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [week_number, year, start_date, end_date]);

  res.status(201).json(result.rows[0]);
});

// Editar semana
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { week_number, year, start_date, end_date } = req.body;
  const result = await db.query(`
    UPDATE work_weeks
    SET week_number = $1, year = $2, start_date = $3, end_date = $4
    WHERE id = $5
    RETURNING *
  `, [week_number, year, start_date, end_date, id]);

  res.json(result.rows[0]);
});

// Eliminar semana
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM work_weeks WHERE id = $1', [id]);
  res.status(204).send();
});

module.exports = router;
