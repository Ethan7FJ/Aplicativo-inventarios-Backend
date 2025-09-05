import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bcrypt from "bcryptjs";
import { db } from "./db.js";
/* import jwt from "jsonwebtoken"; */

const app = express();
app.use(cors());
app.use(express.json())

const SECRET = '';

/* Peticion de registro */

app.post("/registro", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si ya existe
    const [rows]: any = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length > 0) {
      return res.status(400).json({ error: "El usuario ya está registrado" });
    }

    // Hashear contraseña
    const passwordCript = await bcrypt.hash(password, 10);

    // Insertar en DB
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      passwordCript,
    ]);

    res.json({ success: true, user: { username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});



const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Usuario conectado:", socket.id);

  socket.on("chatMessage", (msg) => {
    const messageData = {
      id: socket.id,
      user: msg.user,
      text: msg.text,
    };

    io.emit("chatMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("❌ Usuario desconectado:", socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:4000");
});

