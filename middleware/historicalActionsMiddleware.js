const client = require('../db');

const historicalActionsMiddleware = async (req, res, next) => {
  try {
    // Extraer información del usuario (asumiendo que tienes autenticación implementada)
    const user = req.user ? req.user.username : 'Unknown User'; // Cambia según tu implementación de autenticación
    const action = `${req.method} ${req.originalUrl}`;
    const timestamp = new Date();

    // Registrar la acción en la base de datos
    await client.query(
      "INSERT INTO HistoricalActions (username, action, timestamp) VALUES ($1, $2, $3)",
      [user, action, timestamp]
    );

    next(); // Continuar con la siguiente capa de middleware o ruta
  } catch (error) {
    console.error("Error logging historical action:", error.message);
    next(); // Continuar incluso si ocurre un error al registrar
  }
};


module.exports = historicalActionsMiddleware;