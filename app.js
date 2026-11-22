const express = require('express');
const cors = require('cors');
const { crear, buscarPorCuentaConHash } = require('./Modelo/usuarios');
const { validarCorreo } = require('./src/validaciones'); // <--- Importa la validación

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/login', async (req, res) => {
    try {
        const { cuenta, contrasena } = req.body;

        if (!cuenta || !contrasena) {
            return res.status(400).json({ error: 'Faltan campos obligatorios.' });
        }

        const usuario = await buscarPorCuentaConHash(cuenta);

        if (!usuario) {
            return res.status(404).json({ error: 'La cuenta no existe.' });
        }

        if (usuario.contrasena !== contrasena) {
            return res.status(401).json({ error: 'Contraseña incorrecta.' });
        }

        res.json({
            mensaje: '¡Inicio de sesión exitoso!',
            usuario: {
                idusuarios: usuario.idusuarios,
                nombre: usuario.nombre,
                cuenta: usuario.cuenta,
                rol_idrol: usuario.rol_idrol
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ error: 'Hubo un error en el servidor al iniciar sesión.' });
    }
});

// Ruta para registrar el usuario
app.post('/api/registro', async (req, res) => {
    try {
        const { rol, nombre, correo, cuenta, contrasena } = req.body;

        console.log("Datos recibidos:", { rol, nombre, correo, cuenta, contrasena });

        if (!rol || !nombre || !correo || !cuenta || !contrasena) {
            return res.status(400).json({ error: 'Faltan campos obligatorios.' });
        }

        // Aplicamos la validación del correo con expresiones regulares
        if (!validarCorreo(correo)) {
            return res.status(400).json({ error: 'El formato del correo electrónico no es válido.' });
        }

        let rol_idrol = 1;
        if (rol === 'Donador') rol_idrol = 1;
        else if (rol === 'Receptor') rol_idrol = 2;
        else if (rol === 'Voluntario') rol_idrol = 3;

        const nuevoUsuario = await crear({
            nombre,
            correo,      // <--- Enviado al modelo
            cuenta,
            contrasena,
            rol_idrol
        });

        res.status(201).json({ 
            mensaje: '¡Cuenta registrada con éxito!', 
            usuario: nuevoUsuario 
        });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Hubo un error en el servidor al registrar el usuario.' });
    }
});

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});