📦 Inventory CRUD API (Backend)

Este es el backend de la aplicación de gestión de inventarios.
Desarrollado con Node.js + Express y MySQL, expone una API RESTful que permite realizar operaciones CRUD sobre productos.

🚀 Tecnologías utilizadas

Node.js

Express.js

MySQL

Cors

JWT (para autenticación, si aplica)

dotenv (manejo de variables de entorno)

⚙️ Funcionalidades

✅ Crear productos en el inventario
✅ Listar productos registrados
✅ Editar productos existentes
✅ Eliminar productos
✅ Conexión segura a base de datos MySQL

📡 Endpoints principales
🔹 Productos

GET /productos → Listar todos los productos

POST /registro-productos → Crear un nuevo producto

PUT /editar/producto/:id → Actualizar un producto existente

DELETE /borrar/producto/:id → Eliminar un producto

🛠️ Instalación y uso

Clona este repositorio en tu máquina local:

git clone https://github.com/Ethan7FJ/Aplicativo-inventarios-Backend.git
cd Aplicativo-inventarios-Backend


Instala las dependencias:

npm install
# o
yarn install


Configura el archivo .env con tus credenciales de MySQL:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=inventory_db
PORT=4000
JWT_SECRET=tu_secreto (si usas auth)


Ejecuta el servidor en desarrollo:

npm run dev


Por defecto la API estará disponible en:
👉 http://localhost:4000

📂 Estructura del proyecto
src/
 ├── authMiddleware/    # Middlewares (auth, validaciones)
 ├── db.js         # Configuración principal de Express
 └── server.js      # Punto de entrada del servidor

📬 Contacto

👨‍💻 Desarrollado por Johan Ruiz – Desarrollador Web Junior

✉️ Email: johanfetecua11@gmail.com

🌐 GitHub: github.com/Ethan7FJ

💼 LinkedIn: linkedin.com/in/johan-fetecua-23a026358
