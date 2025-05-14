const express = require("express");
const router = express.Router();
const client = require("../../../db");

// GET: Obtener todos los registros
router.get("/", async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM employee_supervisor
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener los registros:", error);
    res.status(500).json({ error: "Error al obtener los registros" });
  }
});

// GET: Obtener un registro por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      `SELECT * FROM employee_supervisor WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ error: "Error al obtener el registro" });
  }
});

// POST: Crear un nuevo registro
router.post("/", async (req, res) => {
  const { employee_id, supervisor_id, start_date, end_date, active } = req.body;
  try {
    const result = await client.query(
      `INSERT INTO employee_supervisor (employee_id, supervisor_id, start_date, end_date, active)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [employee_id, supervisor_id || null, start_date, end_date, active]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear el registro:", error);
    res.status(500).json({ error: "Error al crear el registro" });
  }
});

// PUT: Actualizar un registro por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { employee_id, supervisor_id, start_date, end_date, active } = req.body;
  try {
    const result = await client.query(
      `UPDATE employee_supervisor
       SET employee_id = $1, supervisor_id = $2, start_date = $3, end_date = $4, active = $5
       WHERE id = $6 RETURNING *`,
      [employee_id, supervisor_id, start_date, end_date, active, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({ error: "Error al actualizar el registro" });
  }
});

// DELETE: Eliminar un registro por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query(
      `DELETE FROM employee_supervisor WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Registro no encontrado" });
    }
    res.status(200).json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    res.status(500).json({ error: "Error al eliminar el registro" });
  }
});

module.exports = router;