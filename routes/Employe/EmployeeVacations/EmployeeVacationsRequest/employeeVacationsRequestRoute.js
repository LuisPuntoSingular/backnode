const express = require('express');
const router = express.Router();
const db = require('../../../../db');


// GET /api/employeeVacationRequest/approved-days-multi?employee_ids=64,65,66&start_date=2025-06-01&end_date=2025-06-30
router.get("/approved-days-multi", async (req, res) => {
  const { employee_ids, start_date, end_date } = req.query;

  if (!employee_ids || !start_date || !end_date) {
    return res.status(400).json({ error: "employee_ids, start_date y end_date son requeridos" });
  }

  // Convierte employee_ids a array de enteros
  const ids = employee_ids.split(",").map(Number);

  // Busca solicitudes aprobadas para esos empleados
  const requests = await db.query(
    `SELECT id, employee_id FROM employee_vacation_requests
     WHERE employee_id = ANY($1::int[]) AND status = 'approved'`,
    [ids]
  );
  const requestIds = requests.rows.map(r => r.id);

  let days = [];
  if (requestIds.length) {
    const daysResult = await db.query(
      `SELECT d.vacation_date, r.employee_id
       FROM employee_vacation_request_days d
       JOIN employee_vacation_requests r ON d.request_id = r.id
       WHERE d.request_id = ANY($1::int[])
         AND d.vacation_date BETWEEN $2 AND $3`,
      [requestIds, start_date, end_date]
    );
    days = daysResult.rows;
  }

  // Agrupa por empleado
  const result = {};
  ids.forEach(id => { result[id] = []; });
  days.forEach(d => {
    const empId = d.employee_id;
    const dateStr = d.vacation_date.toISOString().slice(0, 10);
    if (!result[empId]) result[empId] = [];
    result[empId].push(dateStr);
  });

  res.json(result);
});

// Obtener todas las solicitudes de un empleado
router.get("/employee/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const requests = await db.query(
      "SELECT * FROM employee_vacation_requests WHERE employee_id = $1 ORDER BY requested_at DESC",
      [employeeId]
    );
    // Opcional: incluir días
    const ids = requests.rows.map(r => r.id);
    let days = [];
    if (ids.length) {
      const daysResult = await db.query(
        "SELECT * FROM employee_vacation_request_days WHERE request_id = ANY($1::int[])",
        [ids]
      );
      days = daysResult.rows;
    }
    const requestsWithDays = requests.rows.map(r => ({
      ...r,
      days: days.filter(d => d.request_id === r.id),
    }));
    res.json(requestsWithDays);
  } catch (error) {
    console.error("Error al obtener solicitudes de empleado:", error);
    res.status(500).json({ message: "Error al obtener solicitudes de empleado." });
  }
});

// Obtener una solicitud específica
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await db.query(
      "SELECT * FROM employee_vacation_requests WHERE id = $1",
      [id]
    );
    const days = await db.query(
      "SELECT * FROM employee_vacation_request_days WHERE request_id = $1",
      [id]
    );
    res.json({ ...request.rows[0], days: days.rows });
  } catch (error) {
    console.error("Error al obtener la solicitud:", error);
    res.status(500).json({ message: "Error al obtener la solicitud." });
  }
});

// Crear nueva solicitud
router.post("/", async (req, res) => {
  try {
    const { employee_id, days } = req.body;
    const total_days = days.reduce((sum, d) => sum + (d.is_half_day ? 0.5 : 1), 0);

    const requestResult = await db.query(
      "INSERT INTO employee_vacation_requests (employee_id, total_days) VALUES ($1, $2) RETURNING *",
      [employee_id, total_days]
    );
    const requestId = requestResult.rows[0].id;

    for (const d of days) {
      await db.query(
        "INSERT INTO employee_vacation_request_days (request_id, vacation_date, is_half_day) VALUES ($1, $2, $3)",
        [requestId, d.date, d.is_half_day || false]
      );
    }
    res.json({ success: true, request_id: requestId });
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    res.status(500).json({ message: "Error al crear la solicitud." });
  }
});

// PATCH /api/employeeVacationRequest/:id/status
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status, decision_by } = req.body;
  const reviewed_at = new Date();

  // Actualiza el estatus de la solicitud
  await db.query(
    "UPDATE employee_vacation_requests SET status = $1, decision_by = $2, reviewed_at = $3 WHERE id = $4",
    [status, decision_by, reviewed_at, id]
  );

  // Si se aprueba, suma los días usados al balance
  if (status === "approved") {
    // Obtén la solicitud y los días
    const reqResult = await db.query("SELECT * FROM employee_vacation_requests WHERE id = $1", [id]);
    const request = reqResult.rows[0];
    const daysResult = await db.query("SELECT vacation_date FROM employee_vacation_request_days WHERE request_id = $1", [id]);
    const days = daysResult.rows.map(d => d.vacation_date);
    const year = new Date(days[0]).getFullYear(); // Asume que todas las fechas son del mismo año

    // Suma los días usados
    await db.query(
      "UPDATE employee_vacation_balance SET used_days = used_days + $1 WHERE employee_id = $2 AND year = $3",
      [request.total_days, request.employee_id, year]
    );
  }

  res.json({ success: true });
});





// GET /api/employeeVacationRequest/approved-days?employee_id=64&start_date=2025-06-01&end_date=2025-06-30
router.get("/approved-days", async (req, res) => {
  const { employee_id, start_date, end_date } = req.query;

  if (!employee_id || !start_date || !end_date) {
    return res.status(400).json({ error: "employee_id, start_date y end_date son requeridos" });
  }

  // Busca solicitudes aprobadas en el rango
  const requests = await db.query(
    `SELECT id FROM employee_vacation_requests
     WHERE employee_id = $1 AND status = 'approved'`,
    [employee_id]
  );
  const requestIds = requests.rows.map(r => r.id);

  let days = [];
  if (requestIds.length) {
    const daysResult = await db.query(
      `SELECT vacation_date FROM employee_vacation_request_days
       WHERE request_id = ANY($1::int[])
         AND vacation_date BETWEEN $2 AND $3`,
      [requestIds, start_date, end_date]
    );
    days = daysResult.rows.map(d => d.vacation_date.toISOString().slice(0, 10));
  }

  res.json(days);
});





module.exports = router;







