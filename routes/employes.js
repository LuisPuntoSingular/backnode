const express = require("express");
const router = express.Router();
const client = require('../db');

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
    photo,
    name,
    last_name_paterno,
    last_name_materno,
    position,
    salary,
    hire_date,
    phone_number,
    emergency_contact,
    nss,
    status
  } = req.body;

  try {
    const result = await client.query(
      `INSERT INTO employees (photo, name, last_name_paterno, last_name_materno, position, salary, hire_date, phone_number, emergency_contact, nss, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [photo, name, last_name_paterno, last_name_materno, position, salary, hire_date, phone_number, emergency_contact, nss, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un empleado existente
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    photo,
    name,
    last_name_paterno,
    last_name_materno,
    position,
    salary,
    hire_date,
    phone_number,
    emergency_contact,
    nss,
    status
  } = req.body;

  try {
    const result = await client.query(
      `UPDATE employees
       SET photo = $1, name = $2, last_name_paterno = $3, last_name_materno = $4, position = $5, salary = $6, hire_date = $7, phone_number = $8, emergency_contact = $9, nss = $10, status = $11
       WHERE id = $12 RETURNING *`,
      [photo, name, last_name_paterno, last_name_materno, position, salary, hire_date, phone_number, emergency_contact, nss, status, id]
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