const express = require("express");
const router = express.Router();
const client = require('../../db');

// Obtener todos los empleados
router.get("/", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT e.*, w.work_area_name
      FROM employees e
      LEFT JOIN work_areas w ON e.work_area_id = w.id
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo empleado
router.post("/", async (req, res) => {
  const {
    name,
    last_name_paterno,
    last_name_materno,
    work_area_id,  // antes era 'position'
    salary,
    hire_date,
    status
  } = req.body;

  try {
    await client.query('BEGIN');

    const employeeResult = await client.query(
      `INSERT INTO employees (name, last_name_paterno, last_name_materno, work_area_id, salary, hire_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [name, last_name_paterno, last_name_materno, work_area_id, salary, hire_date, status]
    );

    const newEmployeeId = employeeResult.rows[0].id;

    await client.query(
      `INSERT INTO employee_documents (employee_id) VALUES ($1)`,
      [newEmployeeId]
    );

    await client.query('COMMIT');

    res.status(201).json({ message: "Employee and documents created successfully", employeeId: newEmployeeId });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un empleado existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    name,
    last_name_paterno,
    last_name_materno,
    work_area_id,  // antes era 'position'
    salary,
    hire_date,
    status
  } = req.body;

  try {
    const result = await client.query(
      `UPDATE employees
       SET name = $1, last_name_paterno = $2, last_name_materno = $3, work_area_id = $4, salary = $5, hire_date = $6, status = $7
       WHERE id = $8 RETURNING *`,
      [name, last_name_paterno, last_name_materno, work_area_id, salary, hire_date, status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un empleado
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query(
      "DELETE FROM employees WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
