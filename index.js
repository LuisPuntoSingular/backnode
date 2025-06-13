// index.js
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const historicalActionsMiddleware = require('./middleware/historicalActionsMiddleware');
const cron = require('node-cron');
const { refreshEmployeeVacationBalance } = require('./routes/Employe/EmployeeVacations/EmployeeVacationsBalance/Services/employeeVacationsService'); // Importa la función para actualizar el balance de vacaciones



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

const employeeNomina = require("./routes/Employe/PayRoll/EmployeePayRoll/employePayRoll"); // Rutas de nómina de empleados
const employeeNominaStatus = require("./routes/Employe/PayRoll/EmployeePayRollStatus/employePayRollStatus"); 
const employeeRoutes = require("./routes/Employe/employes");
const employeeDocumentsRoutes = require("./routes/Employe/employesDocuments");
const employeePersonalInformationRoutes = require("./routes/Employe/EmployeePersonalInformation/employePersonalInformation");
const employeeBeneficiaryRoutes = require("./routes/Employe/EmployeeBeneficiary/employeeBeneficiary");
const employeeAdressContact = require("./routes/Employe/EmployeeAdressContact/employeeAdressContact");
const employeeBoss = require("./routes/Employe/EmployeeBoss/employeeboss");
const employeevacationRoutes = require('./routes/Employe/EmployeeVacations/EmployeeVacationsBalance/employeeVacationsBalanceRoute'); // Rutas de vacaciones de empleados
const employeeVacationRequestRoutes = require('./routes/Employe/EmployeeVacations/EmployeeVacationsRequest/employeeVacationsRequestRoute'); // Rutas de solicitudes de vacaciones de empleados
const employeeVacationsRequestDaysRoutes = require('./routes/Employe/EmployeeVacations/EmployeeVacationsRequestDays/employeeVacationsRequestDaysRoute'); // Rutas de días solicitados de vacaciones de empleados



const workAreasRoutes = require('./routes/WorkAreas/workAreas.routes');

const plantsRoutes = require("./routes/Employe/Plant/plant");
const attendanceRoutes = require('./routes/EmployeeHumanResources/EmployeeAttendance/attendanceRoutes');
const workWeeksRoutes = require('./routes/EmployeeHumanResources/workWeeksRoutes');
const holidaysRoutes = require('./routes/EmployeeHumanResources/holidaysRoutes');
const codesRoutes = require('./routes/EmployeeHumanResources/EmployeeAttendanceCodes/attendanceCodeRoutes');

//cron 

 




const app = express();
// Usa cookie-parser
app.use(cookieParser());
// Configurar CORS
app.use(cors({
    origin: ["http://localhost:3000", "https://www.autopackerp.com","http://localhost:3001"], // Dominio permitido (tu frontend)
    credentials: true, // Permitir el envío de cookies y encabezados de autenticación
  }));
app.use(express.json());

app.use("/auth", authRoutes); // Rutas de autenticación


// Ejecutar cada 1ro de mes a las 5 AM hora de Aguascalientes
cron.schedule('0 5 1 * *', async () => {
  console.log(`[${new Date().toISOString()}] Ejecutando balance de vacaciones...`);
  try {
    await refreshEmployeeVacationBalance();
    console.log(`[${new Date().toISOString()}] ✅ Balance ejecutado con éxito`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Error al ejecutar balance`, err);
  }
}, {
  timezone: 'America/Mexico_City'
});


app.use("/api/employeeVacations", employeevacationRoutes);
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

app.use("/api/employeePayRoll", employeeNomina); // Rutas de nómina de empleados
app.use("/api/employeePayRollStatus", employeeNominaStatus); // Rutas de estado de nómina de 
app.use("/api/employee", employeeRoutes); // Rutas de empleados
app.use("/api/employeePersonalInformation", employeePersonalInformationRoutes); // Rutas de información personal de empleados
app.use("/api/employeeBeneficiary", employeeBeneficiaryRoutes); // Rutas de beneficiarios de empleados
app.use("/api/employeeAddressContact", employeeAdressContact); // Rutas de dirección y contacto de empleados 
app.use("/api/plants", plantsRoutes); // Rutas de plantas
app.use("/api/employeeBoss", employeeBoss); // Rutas de jefes de empleados


app.use("/api/employeeVacationRequest", employeeVacationRequestRoutes); // Rutas de solicitudes de vacaciones de empleados
app.use("/api/employeeVacationsRequestDays", employeeVacationsRequestDaysRoutes); // Rutas de días solicitados de vacaciones de empleados


// Rutas de documentos de empleados
app.use("/api/employeeDocuments", employeeDocumentsRoutes);

// Rutas de Areas de trabajo
 app.use('/api/work-areas', workAreasRoutes);

// Rutas de asistencia
app.use('/api/attendance', attendanceRoutes);
// Rutas de semanas laborales
app.use('/api/work-weeks', workWeeksRoutes);
// Rutas de días festivos
app.use('/api/holidays', holidaysRoutes);
// Rutas de códigos de asistencia
app.use('/api/attendance-codes', codesRoutes);


app.use("/api", privateRoutes); // Rutas protegidas




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`http://localhost: ${PORT}`));