const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Bienvenido al dashboard", user: req.user });
});

module.exports = router;