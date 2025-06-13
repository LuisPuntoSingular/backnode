const express = require('express');
const router = express.Router();
const db = require('../../../db');





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

// GET all attendance records
router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM attendance');
  res.json(result.rows);
});

// POST new attendance record and check for duplicates
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

// PUT update attendance record by employee_id and date
router.put('/', async (req, res) => {
  const { employee_id, date, code, week_id, overtime_hours, is_sunday, is_holiday, remarks } = req.body;

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
       SET code = $1, week_id = $2, overtime_hours = $3, is_sunday = $4, is_holiday = $5, remarks = $6
       WHERE employee_id = $7 AND date = $8
       RETURNING *`,
      [code, week_id, overtime_hours, is_sunday, is_holiday, remarks, employee_id, date]
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


// GET: Obtener registros de asistencia por empleado, rango de fechas y week_id
router.get('/by-employee-and-date-range', async (req, res) => {
  const { employee_id, start_date, end_date, week_id } = req.query;

  if (!employee_id || !start_date || !end_date || !week_id) {
    return res.status(400).json({ message: 'Faltan parámetros requeridos.' });
  }

  try {
    const result = await db.query(
      `SELECT id, employee_id, date, code, week_id, overtime_hours
       FROM attendance
       WHERE employee_id = $1
         AND date BETWEEN $2 AND $3
         AND week_id = $4
       ORDER BY date ASC`,
      [employee_id, start_date, end_date, week_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener registros de asistencia:', error);
    res.status(500).json({ message: 'Error al obtener registros de asistencia.' });
  }
});






module.exports = router;
