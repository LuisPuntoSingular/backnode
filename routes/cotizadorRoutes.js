// routes/cotizadorRoutes.js
const express = require("express");
const router = express.Router();
const { getCotizadorData } = require("../controllers/cotizadorController");


// Definir la ruta para obtener datos del cotizador
router.get("/", getCotizadorData);

module.exports = router;
