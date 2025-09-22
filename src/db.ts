import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",   // tu usuario de MySQL
  password: process.env.DB_PASSWORD || "Mortalkom12345", // tu contraseña de MySQL
  database: process.env.DB_NAME || "inventario  ", // la base de datos que creaste
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});