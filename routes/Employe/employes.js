const express = require("express");
const router = express.Router();
const client = require('../../db');

// Obtener todos los empleados
router.get("/", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM employees
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Obtener un empleado por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(`
      SELECT * FROM employees WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Crear un nuevo empleado
router.post("/", async (req, res) => {
  const {
    first_name,
    second_name,
    last_name_paterno,
    last_name_materno,
    work_area_id,
    salary,
    hire_date,
    nss_date,
    status,
    plant_id // Nuevo campo
  } = req.body;

  try {
    await client.query('BEGIN');

    const employeeResult = await client.query(
      `INSERT INTO employees (first_name, second_name, last_name_paterno, last_name_materno, work_area_id, salary, hire_date, nss_date, status, plant_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [first_name, second_name, last_name_paterno, last_name_materno, work_area_id, salary, hire_date, nss_date, status, plant_id]
    );

    const newEmployeeId = employeeResult.rows[0].id;

    await client.query(
      `INSERT INTO employee_documents (employee_id) VALUES ($1)`,
      [newEmployeeId]
    );

    await client.query('COMMIT');

    res.status(201).json({ message: "Employee and documents created successfully", id: newEmployeeId });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un empleado existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    second_name,
    last_name_paterno,
    last_name_materno,
    work_area_id,
    salary,
    hire_date,
    nss_date,
    status,
    plant_id // Nuevo campo
  } = req.body;

  try {
    const result = await client.query(
      `UPDATE employees
       SET first_name = $1, second_name = $2, last_name_paterno = $3, last_name_materno = $4, work_area_id = $5, salary = $6, hire_date = $7, nss_date = $8, status = $9, plant_id = $10
       WHERE id = $11 RETURNING *`,
      [first_name, second_name, last_name_paterno, last_name_materno, work_area_id, salary, hire_date, nss_date, status, plant_id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
