const pool = require('../DB/DB_Localhost');

const COLUMNAS_PUBLICAS = 'idusuarios, nombre, rol_idrol, cuenta, correo';

//consultar todos los usuarios
async function listar() {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios ORDER BY idusuarios`); 
    return filas;
}

//consultar por ID
async function obtenerPorId(idusuarios) {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios WHERE idusuarios = ?`, [idusuarios]);
    return filas[0];    
}

//consultar por nombre
async function obtenerPorNombre(nombre) {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios WHERE nombre = ?`, [nombre]);
    return filas[0];    
}

//Crear un usuario (Añadido 'correo')
async function crear({ nombre, correo, cuenta, contrasena, rol_idrol }) {
    const [info] = await pool.query(`
    INSERT INTO usuarios (nombre, correo, cuenta, contrasena, rol_idrol) VALUES (?, ?, ?, ?, ?)`, 
    [nombre, correo, cuenta, contrasena, rol_idrol]);
    return obtenerPorId(info.insertId);    
}

//actualizar a un usuario
async function actualizar(idusuarios, {nombre, correo, cuenta, rol_idrol}) {
    const cambios = Object.entries({nombre, correo, cuenta, rol_idrol}).filter(([, valor])=> valor !== undefined);
    if(cambios.length === 0) return obtenerPorId(idusuarios); 
    const columnas = cambios.map(([columna]) => `${columna} = ?`).join(', ');
    const [info] = await pool.query(`UPDATE usuarios SET ${columnas} WHERE idusuarios = ?`, [...cambios.map(([, valor]) => valor), idusuarios]);
    if(info.affectedRows === 0) return undefined;
    return obtenerPorId(idusuarios);
}

//eliminar un usuario
async function eliminar(idusuarios) {
    const [info] = await pool.query(`DELETE FROM usuarios WHERE idusuarios = ?`, [idusuarios]);
    return info.affectedRows > 0;   
}

//buscar un usuario por cuenta y hash
async function buscarPorCuentaConHash(cuenta) {
    const [filas] = await pool.query('SELECT * FROM usuarios WHERE cuenta = ?', [cuenta]);
    return filas[0];
}

module.exports = {listar, obtenerPorId, crear, actualizar, eliminar, buscarPorCuentaConHash};