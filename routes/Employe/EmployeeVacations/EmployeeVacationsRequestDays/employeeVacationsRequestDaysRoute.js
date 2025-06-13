const express = require('express');
const router = express.Router();
const db = require('../../../../db'); // Asegúrate de que la ruta sea correcta a tu conexión PG

// Obtener días de una solicitud
router.get("/request/:requestId", async (req, res) => {
  try {
    const { requestId } = req.params;
    const result = await db.query(
      "SELECT * FROM employee_vacation_request_days WHERE request_id = $1",
      [requestId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener días de la solicitud:", error);
    res.status(500).json({ message: "Error al obtener días de la solicitud." });
  }
});

// Agregar día a una solicitud
router.post("/", async (req, res) => {
  try {
    const { request_id, vacation_date, is_half_day } = req.body;
    const result = await db.query(
      "INSERT INTO employee_vacation_request_days (request_id, vacation_date, is_half_day) VALUES ($1, $2, $3) RETURNING *",
      [request_id, vacation_date, is_half_day || false]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar día a la solicitud:", error);
    res.status(500).json({ message: "Error al agregar día a la solicitud." });
  }
});

// Eliminar día de una solicitud
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      "DELETE FROM employee_vacation_request_days WHERE id = $1",
      [id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar día de la solicitud:", error);
    res.status(500).json({ message: "Error al eliminar día de la solicitud." });
  }
});

module.exports = router;