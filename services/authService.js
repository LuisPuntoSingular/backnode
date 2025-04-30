const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../db"); // Asegúrate de que la ruta sea correcta

// Registrar un nuevo usuario
const registerUser = async (email, password, role = 'user') => {
  const hashedPassword = await bcrypt.hash(password, 10); // Encripta la contraseña
  const query = `
    INSERT INTO users (email, password_hash, role)
    VALUES ($1, $2, $3)
    RETURNING id, email, role, created_at;
  `;
  const values = [email, hashedPassword, role];

  try {
    const result = await client.query(query, values);
    return result.rows[0]; // Devuelve el usuario registrado
  } catch (err) {
    throw new Error("Error al registrar el usuario: " + err.message);
  }
};

// Autenticar un usuario existente
const authenticateUser = async (email, password) => {
  const query = `SELECT id, email, password_hash, role FROM users WHERE email = $1`; // Incluye el campo 'role'
  try {
    const result = await client.query(query, [email]);

    if (result.rows.length === 0) {
      throw new Error("Usuario no encontrado");
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta");
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, // Incluye 'role' en el payload del token
      process.env.JWT_SECRET,
      {
        expiresIn: "20m", // Expira en 20 minutos
      }
    );

    return { 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role // Incluye 'role' en la respuesta
      } 
    };
  } catch (err) {
    throw new Error("Error al autenticar el usuario: " + err.message);
  }
};

module.exports = { registerUser, authenticateUser };