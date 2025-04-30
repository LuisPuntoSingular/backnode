const pool = require('../db');

// Obtener todas las áreas
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM work_areas ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una sola área por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM work_areas WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Área no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear nueva área
exports.create = async (req, res) => {
  try {
    const { work_area_name, parent_id } = req.body;
    const result = await pool.query(
      'INSERT INTO work_areas (work_area_name, parent_id) VALUES ($1, $2) RETURNING *',
      [work_area_name, parent_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar área
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { work_area_name, parent_id } = req.body;
    const result = await pool.query(
      'UPDATE work_areas SET work_area_name = $1, parent_id = $2 WHERE id = $3 RETURNING *',
      [work_area_name, parent_id || null, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Área no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar área
exports.remove = async (req, res) => {
  try {
    
    const { id } = req.params;
    await pool.query('DELETE FROM work_areas WHERE id = $1', [id]);
    res.json({ message: 'Área eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
