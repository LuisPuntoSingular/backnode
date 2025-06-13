const Client = require("../../../../../db"); // ajusta esto si tienes un pool diferente


async function refreshEmployeeVacationBalance() {
  try {
    console.log('⏳ Ejecutando función SQL refresh_employee_vacation_balance...');
    await Client.query('SELECT update_employee_vacation_balance()');
    console.log('✅ Balance de vacaciones actualizado.');
  } catch (err) {
    console.error('❌ Error ejecutando la función de balance:', err);
  }
}

module.exports = { refreshEmployeeVacationBalance };