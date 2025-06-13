const express = require('express');
const router = express.Router();
const { refreshEmployeeVacationBalance } = require('./Services/employeeVacationsService');
const db = require('../../../../db');

// Ruta manual para actualizar balance de vacaciones
router.post('/actualizar-vacaciones', async (req, res) => {
  try {
    await refreshEmployeeVacationBalance();
    res.status(200).json({ message: 'Balance de vacaciones actualizado correctamente.' });
  } catch (error) {
    console.error('❌ Error al actualizar manualmente:', error);
    res.status(500).json({ error: 'Error al actualizar el balance de vacaciones.' });
  }
});

// Obtener balances por empleado
router.get("/employee/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const result = await db.query(
      "SELECT * FROM employee_vacation_balance WHERE employee_id = $1 ORDER BY year DESC",
      [employeeId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener balances por empleado:', error);
    res.status(500).json({ error: 'Error al obtener balances por empleado.' });
  }
});

// Obtener balance por empleado y año
router.get("/employee/:employeeId/year/:year", async (req, res) => {
  try {
    const { employeeId, year } = req.params;
    const result = await db.query(
      "SELECT * FROM employee_vacation_balance WHERE employee_id = $1 AND year = $2",
      [employeeId, year]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener balance por empleado y año:', error);
    res.status(500).json({ error: 'Error al obtener balance por empleado y año.' });
  }
});

// Actualizar used_days
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { used_days } = req.body;
    await db.query(
      "UPDATE employee_vacation_balance SET used_days = $1, last_updated = now() WHERE id = $2",
      [used_days, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar used_days:', error);
    res.status(500).json({ error: 'Error al actualizar used_days.' });
  }
});

module.exports = router;