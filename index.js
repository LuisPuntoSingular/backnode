// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const historicalActionsMiddleware = require('./middleware/historicalActionsMiddleware');


const materialsRoutes = require("./routes/Materials/materials");
const derivativesRoutes = require("./routes/Materials/Cardboard/derivatives");
const resistancesRoutes = require("./routes/Materials/Cardboard/resistances");
const resistancescategoriesRoutes = require("./routes/Materials/Cardboard/resistancecategories");
const epeRoutes = require("./routes/Materials/Epe/epe");
const foamRoutes = require("./routes/Materials/Foam/foam");
const preciosfoamRoutes = require("./routes/Materials/Foam/preciosfoam");
const coloresFoamRoutes = require("./routes/Materials/Foam/coloresfoam");
const coloresPrecioRoutes = require("./routes/Materials/Foam/coloresprecio");
const poliburbujaRoutes = require("./routes/Materials/Polybbuble/poliburbuja");
const poliburbujapreciosRoutes = require("./routes/Materials/Polybbuble/poliburbujaprecios");
const evaRoutes = require("./routes/Materials/Eva/Eva");
const { authenticateToken } = require("./middleware/authMiddleware");
const authRoutes = require("./routes/Auth/authRoutes");
const privateRoutes = require("./routes/Auth/privateRoutes");
const employeeRoutes = require("./routes/Employe/employes");
const employeeDocumentsRoutes = require("./routes/Employe/employesDocuments");
const employeePersonalInformationRoutes = require("./routes/Employe/EmployeePersonalInformation/employePersonalInformation");
const employeeBeneficiaryRoutes = require("./routes/Employe/EmployeeBeneficiary/employeeBeneficiary");
const employeeAdressContact = require("./routes/Employe/EmployeeAdressContact/employeeAdressContact");
const workAreasRoutes = require('./routes/WorkAreas/workAreas.routes');

const plantsRoutes = require("./routes/Employe/Plant/plant");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes); // Rutas de autenticación



// Proteger rutas de la API y registrar acciones
app.use("/api", authenticateToken, historicalActionsMiddleware);


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
app.use("/api/eva", evaRoutes);


app.use("/api/employee", employeeRoutes); // Rutas de empleados
app.use("/api/employeePersonalInformation", employeePersonalInformationRoutes); // Rutas de información personal de empleados
app.use("/api/employeeBeneficiary", employeeBeneficiaryRoutes); // Rutas de beneficiarios de empleados
app.use("/api/employeeAddressContact", employeeAdressContact); // Rutas de dirección y contacto de empleados 
app.use("/api/plants", plantsRoutes); // Rutas de plantas

// Rutas de documentos de empleados
 app.use("/api/employeeDocuments", employeeDocumentsRoutes);


 app.use('/api/work-areas', workAreasRoutes);


app.use("/api", privateRoutes); // Rutas protegidas




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`http://localhost: ${PORT}`));