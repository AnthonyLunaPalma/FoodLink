const pool = require('../DB_Localhost');

const COLUMNAS_PUBLICAS = 'idusuarios, nombre, rol_idrol, cuenta';

//consultar todos los usuarios
async function listar() {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios ORDER BY idusuarios`); // Probabilodad de error al listar usuarios por id
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

//Crear un usuario
async function crear({nombre, correo, contrasenaHash, idrol_rol}) {
    const [info] = await pool.query(`
    INSERT INTO usuarios (nombre, correo, contrasena_hash, rol_idrol) VALUES (?, ?, ?, ?)`, 
    [nombre, correo, contrasenaHash, idrol_rol]);
    return obtenerPorId(info.insertId);    
}

//actualizar a un usuario
async function actualizar(idusuarios, {nombre, correo, rol}) {
    const cambios = Object.entries({nombre, correo, rol}).filter(([, valor])=> valor !== undefined);
    if(cambios.length === 0) return obtenerPorId(idusuarios); //Probabilidad de error por id
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

//buscar un usuario por correo y hash
async function buscarPorCorreoConHash(correo) {
    const [filas] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return filas[0];
}

//siempre es necesario exportar las funciones para poder crear su api
module.exports = {listar, obtenerPorId, crear, actualizar, eliminar, buscarPorCorreoConHash};