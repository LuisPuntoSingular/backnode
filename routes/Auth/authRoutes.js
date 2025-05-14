const express = require("express");
const { registerUser, authenticateUser } = require("../../services/authService");
const { authenticateToken } = require("../../middleware/authMiddleware");

const router = express.Router();

// Registrar un nuevo usuario
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await registerUser(email, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Iniciar sesión
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await authenticateUser(email, password);

    // Almacenar el token en una cookie
    res.cookie("token", token, {
      httpOnly: true, // Asegura que la cookie no sea accesible desde JavaScript del cliente
      secure: process.env.NODE_ENV === "developmet" | "production", // Solo enviar en HTTPS en producción
      maxAge: 20 * 60 * 1000, // 20 minutos
    });

    res.status(200).json({ message: "Inicio de sesión exitoso", user });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

// Validar el token
router.get("/auth/validate-token", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Token válido", user: req.user });
});

// Cerrar sesión
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Eliminar la cookie del token
  res.status(200).json({ message: "Cierre de sesión exitoso" });
});

module.exports = router;