
const db = require('../db'); // Configuración de tu conexión a la base de datos

const getEmployeesByWorkAreaAndPlant = async (req, res) => {
  const { plantId, workAreaId } = req.query;

  try {
    const query = `
      WITH RECURSIVE work_area_hierarchy AS (
        SELECT id
        FROM work_areas
        WHERE id = $1

        UNION ALL

        SELECT wa.id
        FROM work_areas wa
        INNER JOIN work_area_hierarchy wah ON wa.parent_id = wah.id
      )
      SELECT e.id, e.first_name, e.last_name_paterno, e.last_name_materno
      FROM employees e
      INNER JOIN work_area_hierarchy wah ON CAST(e.work_area_id AS INTEGER) = wah.id
      WHERE e.plant_id = $2;
    `;

    const { rows } = await db.query(query, [workAreaId, plantId]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
};

module.exports = ( getEmployeesByWorkAreaAndPlant);