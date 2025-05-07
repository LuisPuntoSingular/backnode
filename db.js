const { Client } = require('pg');

// Asignar un valor predeterminado a NODE_ENV
const environment = process.env.NODE_ENV || 'production';

// Mostrar el entorno actual en la consola
console.log(`Entorno actual: ${environment}`);

// Seleccionar la URL de la base de datos según el entorno
const connectionString =
  environment === 'production'
    ? process.env.DATABASE_URL_PRO // URL de producción
    : process.env.DATABASE_URL_DEV; // URL de desarrollo

// Configuración del cliente de PostgreSQL
const client = new Client({
  connectionString,
  ssl: environment === 'production' ? { rejectUnauthorized: false } : false, // SSL solo en producción
});

// Conectar a la base de datos
client.connect()
  .then(() => {
    console.log(`Conexión exitosa a la base de datos (${environment})`);

  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = client;