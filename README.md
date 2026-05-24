# 💬 Chat App

Aplicación de chat en tiempo real con sistema de usuarios, mensajes globales y privados, tickets y tareas. Desplegada en producción con backend en Render y base de datos en MongoDB Atlas.

##  Demo

🔗 [Ver aplicación](https://chatrm-enb1.onrender.com)

## 🛠 Tecnologías

- **Node.js** + **Express** — servidor backend
- **MongoDB Atlas** — base de datos en la nube (activa)
- **Mongoose** — modelado de datos
- **bcryptjs** — hash de contraseñas
- **CORS** — manejo de solicitudes entre dominios
- **Render** — despliegue del backend y frontend

## ✨ Características

- Registro e inicio de sesión de usuarios
- Mensajes globales y mensajes privados entre usuarios
- Sistema de tickets (abierto / en progreso / cerrado)
- Gestión de tareas
- Mensajes de error y éxito en autenticación

## 📁 Estructura
chat
- index.html        # Frontend
- server.js         # Servidor Express + API REST
- package.json

## ⚙️ Instalación local

```bash
git clone https://github.com/rmonterr4/chat.git
cd chat
npm install
node server.js
```

## 🌐 Despliegue

- **Backend + Frontend:** Render
- **Base de datos:** MongoDB Atlas

## Autor
## Ronald Andres Monterroza Gutierrez
