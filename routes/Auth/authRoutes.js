const express = require("express");
const { registerUser, authenticateUser } = require("../../services/authService");
const { authenticateToken } = require("../../middleware/authMiddleware");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await registerUser(email, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await authenticateUser(email, password);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

// Ruta para validar el token
router.get("/auth/validate-token", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Token válido", user: req.user });
});

module.exports = router;