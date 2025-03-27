const { Client } = require('pg');

// Datos de conexión a la base de datos de Railway
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Usamos la variable de entorno para mantener segura la URL
  ssl: {
    rejectUnauthorized: false, // Necesario para conexiones externas en Railway
  },
});

// Conectar a la base de datos
client.connect()
  .then(() => {
    console.log('Conexión exitosa a la base de datos de Railway');
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
  });

module.exports = client;
