const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../db"); // Asegúrate de que la ruta sea correcta

const registerUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10); // Encripta la contraseña
  const query = `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, created_at;
  `;
  const values = [email, hashedPassword];

  try {
    const result = await client.query(query, values);
    return result.rows[0]; // Devuelve el usuario registrado
  } catch (err) {
    throw new Error("Error al registrar el usuario: " + err.message);
  }
};

const authenticateUser = async (email, password) => {
  const query = `SELECT * FROM users WHERE email = $1`;
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
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Expira en 1 hora
    });

    return { token, user: { id: user.id, email: user.email } };
  } catch (err) {
    throw new Error("Error al autenticar el usuario: " + err.message);
  }
};

module.exports = { registerUser, authenticateUser };