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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Asegúrate de que esto esté configurado correctamente en producción
      sameSite: "None", // Permite el envío entre dominios
    });

    res.status(200).json({ message: "Inicio de sesión exitoso", user });
  } catch (err) {
    res.status(401).json({ message: "Usuario o Contraseña Invalidos" });
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