const express = require("express");
const router = express.Router();
const client = require("../../../../db");

// GET: Obtener campos específicos por employee_id, week_number y year
router.get("/by-employee-week-year", async (req, res) => {
  const { employee_id, week_number, year } = req.query;
  try {
    const result = await client.query(
      `SELECT infonavit, fonacot,total_perceptions, debt, payment, remaining, others, 
              normal_bonus, monthly_bonus, card_payment, cash_payment, total_payment
       FROM employee_payroll 
       WHERE employee_id = $1 AND week_number = $2 AND year = $3`,
      [employee_id, week_number, year]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nómina no encontrada para los parámetros especificados" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error en GET /by-employee-week-year:", error.message, error.stack);
    res.status(500).json({ error: "Error al obtener la nómina", details: error.message });
  }
});

// POST: Crear una nueva nómina
router.post("/", async (req, res) => {
  const fields = [
    "employee_id", "full_name", "week_number", "year",
    "monday_hours", "monday_extra_hours", "tuesday_hours", "tuesday_extra_hours",
    "wednesday_hours", "wednesday_extra_hours", "thursday_hours", "thursday_extra_hours",
    "friday_hours", "friday_extra_hours", "saturday_hours", "saturday_extra_hours",
    "sunday_hours", "sunday_extra_hours", "total_extra_hours", "extra_hours_amount",
    "salary", "infonavit", "fonacot", "total_perceptions", "debt", "payment",
    "remaining", "others", "normal_bonus", "monthly_bonus", "card_payment",
    "cash_payment", "total_payment"
  ];
  const values = fields.map(f => req.body[f]);
  const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");

  try {
    const result = await client.query(
      `INSERT INTO employee_payroll (${fields.join(", ")})
       VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error en POST /by-employee-week-year:", error.message, error.stack);
    res.status(500).json({ error: "Error al crear la nómina", details: error.message });
  }
});



router.put("/by-employee-week-year", async (req, res) => {
  const { employee_id, week_number, year } = req.body;
  const fields = [
    "employee_id", "full_name", "week_number", "year",
    "monday_hours", "monday_extra_hours", "tuesday_hours", "tuesday_extra_hours",
    "wednesday_hours", "wednesday_extra_hours", "thursday_hours", "thursday_extra_hours",
    "friday_hours", "friday_extra_hours", "saturday_hours", "saturday_extra_hours",
    "sunday_hours", "sunday_extra_hours", "total_extra_hours", "extra_hours_amount",
    "salary", "infonavit", "fonacot", "total_perceptions", "debt", "payment",
    "remaining", "others", "normal_bonus", "monthly_bonus", "card_payment",
    "cash_payment", "total_payment"
  ];
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const values = fields.map(f => req.body[f]);
  values.push(employee_id, week_number, year);

  try {
    const result = await client.query(
      `UPDATE employee_payroll SET ${setClause}
       WHERE employee_id = $${fields.length + 1} AND week_number = $${fields.length + 2} AND year = $${fields.length + 3}
       RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nómina no encontrada para los parámetros especificados" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error en PUT /by-employee-week-year:", error.message, error.stack);
    res.status(500).json({ error: "Error al actualizar la nómina", details: error.message });
  }
});




///crud generico para la tabla employee_payroll

// GET: Obtener todas las nóminas
router.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM employee_payroll ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las nóminas" });
  }
});


// GET: Obtener una nómina por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query("SELECT * FROM employee_payroll WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nómina no encontrada" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la nómina" });
  }
});
// PUT: Actualizar una nómina por ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const fields = [
    "employee_id", "full_name", "week_number", "year",
    "monday_hours", "monday_extra_hours", "tuesday_hours", "tuesday_extra_hours",
    "wednesday_hours", "wednesday_extra_hours", "thursday_hours", "thursday_extra_hours",
    "friday_hours", "friday_extra_hours", "saturday_hours", "saturday_extra_hours",
    "sunday_hours", "sunday_extra_hours", "total_extra_hours", "extra_hours_amount",
    "salary", "infonavit", "fonacot", "total_perceptions", "debt", "payment",
    "remaining", "others", "normal_bonus", "monthly_bonus", "card_payment",
    "cash_payment", "total_payment"
  ];
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const values = fields.map(f => req.body[f]);
  values.push(id);

  try {
    const result = await client.query(
      `UPDATE employee_payroll SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
      values
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nómina no encontrada" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la nómina" });
  }
});

// DELETE: Eliminar una nómina por ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await client.query("DELETE FROM employee_payroll WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nómina no encontrada" });
    }
    res.status(200).json({ message: "Nómina eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la nómina" });
  }
});




module.exports = router;