// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const materialsRoutes = require("./routes/materials");
const derivativesRoutes = require("./routes/derivatives");
const resistancesRoutes = require("./routes/resistances");
const resistancescategoriesRoutes = require("./routes/resistancecategories");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/materials", materialsRoutes);
app.use("/api/derivatives", derivativesRoutes);
app.use("/api/resistances", resistancesRoutes);
app.use("/api/resistancescategories", resistancescategoriesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en el puerto ${PORT}`));