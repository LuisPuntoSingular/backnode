const client = require('../db');

const historicalActionsMiddleware = async (req, res, next) => {
  try {
    // Ignorar los métodos GET
    if (req.method === 'GET') {
      return next();
    }

    // Verificar si el usuario está autenticado
    const user = req.user ? req.user.email : 'Unknown User'; // Usar el email del usuario autenticado
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