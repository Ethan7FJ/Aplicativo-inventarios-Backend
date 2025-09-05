import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",     // Cambia si tu MySQL está en otro host
  user: "root",          // Tu usuario de MySQL
  password: "",          // Tu contraseña de MySQL
  database: "inventario" // La base que creaste
});