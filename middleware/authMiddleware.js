const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token; // Obtener el token de las cookies

  if (!token) {
    return res.status(401).json({ message: "Acceso no autorizado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar el usuario decodificado al request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "El token ha expirado" });
    }
    return res.status(403).json({ message: "Token inválido" });
  }
};

module.exports = { authenticateToken };