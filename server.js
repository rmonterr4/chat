const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));


// CONEXION A MONGODB
mongoose.connect("mongodb://ronald_db_user:D1feQ7wVcHfuRlDi@ac-4jx1giq-shard-00-00.sz63anq.mongodb.net:27017,ac-4jx1giq-shard-00-01.sz63anq.mongodb.net:27017,ac-4jx1giq-shard-00-02.sz63anq.mongodb.net:27017/?ssl=true&replicaSet=atlas-12i6za-shard-0&authSource=admin&appName=Arquitectura")
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.log("❌ Error:", err));

// MENSAJES (GLOBAL Y PRIVADOS)
const MensajeSchema = new mongoose.Schema({
    de: String,
    para: String, // null = global
    mensaje: String,
    fecha: { type: Date, default: Date.now }
});
const Mensaje = mongoose.model("Mensaje", MensajeSchema);


// USUARIOS
const UsuarioSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String
});
const Usuario = mongoose.model("Usuario", UsuarioSchema);


// TICKETS
const TicketSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: String,
    estado: { type: String, enum: ["abierto", "en progreso", "cerrado"], default: "abierto" },
    creadoPor: String,
    fecha: { type: Date, default: Date.now }
});
const Ticket = mongoose.model("Ticket", TicketSchema);


// TAREAS
const TareaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descripcion: String,
    completada: { type: Boolean, default: false },
    asignadoA: String,
    creadoPor: String,
    fecha: { type: Date, default: Date.now }
});
const Tarea = mongoose.model("Tarea", TareaSchema);

// AUTENTICACION
// REGISTRO
app.post("/registro", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const nuevo = new Usuario({ username, password: hash });
        await nuevo.save();
        res.json({ ok: true, username });
    } catch (error) {
        res.status(500).json({ error: "Usuario ya existe" });
    }
});

// LOGIN
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Usuario.findOne({ username });
        if (!user) return res.status(401).json({ error: "Usuario no existe" });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });
        res.json({ ok: true, username });
    } catch (error) {
        res.status(500).json({ error: "Error en login" });
    }
});

// USUARIOS
app.get("/usuarios", async (req, res) => {
    const usuarios = await Usuario.find({}, "username");
    res.json(usuarios);
});


// MENSAJES
app.get("/mensajes/:usuario", async (req, res) => {
    const usuario = req.params.usuario;
    const mensajes = await Mensaje.find({
        $or: [
            { para: null },
            { para: usuario },
            { de: usuario }
        ]
    }).sort({ fecha: 1 });
    res.json(mensajes);
});

app.post("/mensaje", async (req, res) => {
    try {
        const { de, para, mensaje } = req.body;
        const nuevo = new Mensaje({ de, para: para || null, mensaje });
        await nuevo.save();
        res.json(nuevo);
    } catch (error) {
        res.status(500).json({ error: "Error al guardar mensaje" });
    }
});


// TICKETS ENDPOINTS
// Crear ticket
app.post("/tickets", async (req, res) => {
    try {
        const { titulo, descripcion, creadoPor } = req.body;
        const nuevo = new Ticket({ titulo, descripcion, creadoPor });
        await nuevo.save();
        res.json(nuevo);
    } catch (error) {
        res.status(500).json({ error: "Error al crear ticket" });
    }
});

// Obtener todos los tickets
app.get("/tickets", async (req, res) => {
    const tickets = await Ticket.find().sort({ fecha: -1 });
    res.json(tickets);
});

// Actualizar estado del ticket
app.put("/tickets/:id", async (req, res) => {
    try {
        const { estado } = req.body;
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { estado },
            { new: true }
        );
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar ticket" });
    }
});

// Eliminar ticket
app.delete("/tickets/:id", async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar ticket" });
    }
});

// TAREAS ENDPOINTS
// Crear tarea
app.post("/tareas", async (req, res) => {
    try {
        const { titulo, descripcion, asignadoA, creadoPor } = req.body;
        const nueva = new Tarea({ titulo, descripcion, asignadoA, creadoPor });
        await nueva.save();
        res.json(nueva);
    } catch (error) {
        res.status(500).json({ error: "Error al crear tarea" });
    }
});

// Obtener todas las tareas
app.get("/tareas", async (req, res) => {
    const tareas = await Tarea.find().sort({ fecha: -1 });
    res.json(tareas);
});

// Marcar tarea como completada / desmarcar
app.put("/tareas/:id", async (req, res) => {
    try {
        const { completada } = req.body;
        const tarea = await Tarea.findByIdAndUpdate(
            req.params.id,
            { completada },
            { new: true }
        );
        res.json(tarea);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar tarea" });
    }
});

// Eliminar tarea
app.delete("/tareas/:id", async (req, res) => {
    try {
        await Tarea.findByIdAndDelete(req.params.id);
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar tarea" });
    }
});


// SERVIDOR
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Servidor corriendo en puerto " + port);
});
