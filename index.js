// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const materialsRoutes = require("./routes/materials");
const derivativesRoutes = require("./routes/derivatives");
const resistancesRoutes = require("./routes/resistances");
const resistancescategoriesRoutes = require("./routes/resistancecategories");
// Importar rutas desde la carpeta routes
const epeRoutes = require("./routes/epe");
const foamRoutes = require("./routes/foam");
const preciosfoamRoutes = require("./routes/preciosfoam");
const coloresFoamRoutes = require("./routes/coloresfoam");
const coloresPrecioRoutes = require("./routes/coloresprecio");
const poliburbujaRoutes = require("./routes/poliburbuja");
const poliburbujapreciosRoutes = require("./routes/poliburbujaprecios");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/materials", materialsRoutes);
app.use("/api/derivatives", derivativesRoutes);
app.use("/api/resistances", resistancesRoutes);
app.use("/api/resistancescategories", resistancescategoriesRoutes);


app.use("/api/epe", epeRoutes);
app.use("/api/foam", foamRoutes);
app.use("/api/preciosfoam", preciosfoamRoutes);
app.use("/api/coloresfoam", coloresFoamRoutes);
app.use("/api/coloresprecio", coloresPrecioRoutes);
app.use("/api/poliburbuja", poliburbujaRoutes);
app.use("/api/poliburbujaprecios", poliburbujapreciosRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));