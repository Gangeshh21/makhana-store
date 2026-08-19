require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("./src/db");

async function createAdmin() {
  try {
    const name = "Makhana Admin";
    const email = "admin@makhanamart.com";
    const password = "Admin@123";

    const passwordHash = await bcrypt.hash(password, 10);

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      await pool.query(
        `UPDATE users
         SET role = 'admin',
             password_hash = $1
         WHERE email = $2`,
        [passwordHash, email]
      );

      console.log("Admin account updated successfully");
    } else {
      await pool.query(
        `INSERT INTO users
         (name, email, password_hash, role)
         VALUES ($1, $2, $3, 'admin')`,
        [name, email, passwordHash]
      );

      console.log("Admin account created successfully");
    }

    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createAdmin();