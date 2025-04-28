const express = require("express");
const router = express.Router();
const client = require('../../db');

// Obtener todos los empleados
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM employees");
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
    position,
    salary,
    hire_date,
    phone_number,
    emergency_contact,
    status
  } = req.body;

  try {
    // Iniciar transacción
    await client.query('BEGIN');

    // Insertar el empleado
    const employeeResult = await client.query(
      `INSERT INTO employees (name, last_name_paterno, last_name_materno, position, salary, hire_date, phone_number, emergency_contact, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [name, last_name_paterno, last_name_materno, position, salary, hire_date, phone_number, emergency_contact, status]
    );

    const newEmployeeId = employeeResult.rows[0].id;

    // Insertar documentos vacíos para el nuevo empleado
    await client.query(
      `INSERT INTO employee_documents (employee_id) VALUES ($1)`,
      [newEmployeeId]
    );

    // Confirmar la transacción
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
    position,
    salary,
    hire_date,
    phone_number,
    emergency_contact,
    status
  } = req.body;

  try {
    const result = await client.query(
      `UPDATE employees
       SET name = $1, last_name_paterno = $2, last_name_materno = $3, position = $4, salary = $5, hire_date = $6, phone_number = $7, emergency_contact = $8, status = $9
       WHERE id = $10 RETURNING *`,
      [name, last_name_paterno, last_name_materno, position, salary, hire_date, phone_number, emergency_contact, status, id]
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
