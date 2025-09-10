import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bcrypt from "bcryptjs";
import { db } from "./db.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { verifyToken } from "./authMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json())

dotenv.config();

const SECRET = process.env.JWT_SECRET as string;

/* Peticion de registro */

app.post("/registro", async (req, res) => {
  const { nombre_usuario, apellido_usuario, email_usuario, password } = req.body;

  try {
    // Verificar si ya existe
    const [rows]: any = await db.query("SELECT * FROM users WHERE nombre_usuario = ? AND apellido_usuario = ? AND email_usuario = ?", [nombre_usuario, apellido_usuario, email_usuario]);
    if (rows.length > 0) {
      return res.status(400).json({ error: "El usuario ya está registrado" });
    }

    // Hashear contraseña
    const passwordCript = await bcrypt.hash(password, 10);

    // Insertar en DB
    await db.query("INSERT INTO users (nombre_usuario,apellido_usuario,email_usuario,password) VALUES (?, ?, ?, ?)", [
      nombre_usuario,
      apellido_usuario,
      email_usuario,
      passwordCript,
    ]);

    res.json({ success: true, user: { nombre_usuario } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.post("/inicio-sesion", async (req, res) => {
  const { email_usuario, password } = req.body;

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM users WHERE email_usuario = ?", [email_usuario]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "El usuario no ha sido encontrado o no se encuentra registrado" })
    }

    const user = rows[0];

    const Validar = await bcrypt.compare(password, user.password);
    if (!Validar) {
      return res.status(401).json({ error: "La contraseña ingresada no es la correcta" })
    }

    const token = jwt.sign(
      { id: user.id, nombre_usuario: user.nombre_usuario, apellido_usuario: user.apellido_usuario, email: user.email_usuario, rol: user.rol },
      SECRET,
      { expiresIn: "1h" }
    )

    res.json({ success: true, token })

  } catch (err) {
    console.log("Error al iniciar sesion", err);
    res.status(500).json({ error: "Error en el servidor" })
  }
});

app.get("/perfil", verifyToken, (req, res) => {
  res.json({ success: true, user: (req as any).user });
});

app.get("/categorias", async (req, res) => {
  try {
    const [categorias] = await db.query("SELECT * FROM categorias");

    const [proveedores] = await db.query("SELECT * FROM proveedores");
    res.json({ success: true, categorias: categorias, proveedores: proveedores })
  } catch (err) {
    console.log("Error traer las categorias", err);
    res.status(500).json({ error: "Error en el servidor" })
  }
});


/* Registro de productos */
app.post("/registro-productos", async (req, res) => {
  const { serial_producto, nombre_producto, descripcion_producto, cantidad_producto, id_categoria, stock, costo_unitario, precio_venta, imagen, id_proveedor, id_user } = req.body;

  try {
    // Verificar si ya existe
    const [rows]: any = await db.query("SELECT * FROM producto WHERE serial_producto = ? ", [serial_producto]);
    if (rows.length > 0) {
      return res.status(400).json({ error: "El usuario ya está registrado" });
    }

    const imagenFinal = (typeof imagen === "string" && imagen.trim() !== "")
      ? imagen.trim()
      : null;


    // Insertar en DB
    await db.query("INSERT INTO producto (serial_producto, nombre_producto, descripcion_producto, cantidad_producto, categoria_id, stock, costo_unitario, precio_venta, imagen, id_provedor, id_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)", [
      serial_producto || null,
      nombre_producto || null,
      descripcion_producto || null,
      cantidad_producto || null,
      id_categoria || null,
      stock || null,
      costo_unitario || null,
      precio_venta || null,
      imagenFinal,
      id_proveedor || null,
      id_user || null,
    ]);

    res.json({ success: true, alerta: `"Producto registrado correctamente con el serial: ", ${serial_producto}` });
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

