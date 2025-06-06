const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET por semana y año
router.get('/by-week', async (req, res) => {
  const { week, year } = req.query;
  const result = await db.query(`
    SELECT a.*, e.first_name, e.last_name_paterno
    FROM attendance a
    JOIN public.employees e ON e.id = a.employee_id
    JOIN work_weeks w ON a.week_id = w.id
    WHERE w.week_number = $1 AND w.year = $2
  `, [week, year]);

  res.json(result.rows);
});

// GET todo
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM attendance');
  res.json(result.rows);
});

// POST nuevo registro
router.post('/', async (req, res) => {
  const { employee_id, date, code, week_id, overtime_hours, is_sunday, is_holiday, remarks } = req.body;

  try {
    // Verificar si ya existe un registro con la misma combinación de employee_id y date
    const existingRecord = await db.query(
      `SELECT * FROM attendance WHERE employee_id = $1 AND date = $2`,
      [employee_id, date]
    );

    if (existingRecord.rows.length > 0) {
      return res.status(400).json({ message: 'Ya existe un registro para este empleado y fecha.' });
    }

    // Insertar el nuevo registro
    const result = await db.query(
      `INSERT INTO attendance (employee_id, date, code, week_id, overtime_hours, is_sunday, is_holiday, remarks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [employee_id, date, code, week_id, overtime_hours, is_sunday, is_holiday, remarks]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al insertar el registro de asistencia:', error);
    res.status(500).json({ message: 'Error al insertar el registro de asistencia.' });
  }
});

// PUT actualizar por employee_id y date
router.put('/', async (req, res) => {
  const { employee_id, date, code, overtime_hours, remarks } = req.body;

  try {
    // Verificar si existe un registro con la combinación de employee_id y date
    const existingRecord = await db.query(
      `SELECT * FROM attendance WHERE employee_id = $1 AND date = $2`,
      [employee_id, date]
    );

    if (existingRecord.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró un registro para este empleado y fecha.' });
    }

    // Actualizar el registro
    const result = await db.query(
      `UPDATE attendance
       SET code = $1, overtime_hours = $2, remarks = $3
       WHERE employee_id = $4 AND date = $5
       RETURNING *`,
      [code, overtime_hours, remarks, employee_id, date]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar el registro de asistencia:', error);
    res.status(500).json({ message: 'Error al actualizar el registro de asistencia.' });
  }
});



// DELETE
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM attendance WHERE id = $1', [id]);
  res.status(204).send();
});

// Get employee a cross relation with attendance

router.get("/getEmployeesAssist", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, plant_id, first_name, second_name, last_name_paterno, last_name_materno, status
      FROM employees
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});









module.exports = router;
