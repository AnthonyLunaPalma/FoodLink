const pool = require('../DB/DB_Localhost');

const COLUMNAS_PUBLICAS = 'idenvio, usuarios_idusuarios, pedidos_idpedidos, status_idstatus, direccionDestino, direccionSalida, fecha';

//consultar todos los envios
async function listar() {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM envios ORDER BY idenvio`); // Probabilodad de error al listar envios por id
}

//consultar por fecha
async function obtenerPorFecha(fecha) {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM envios WHERE fecha = ?`, [fecha]);
    return filas[0];    
}

//Crear un envio
async function crear({usuario_idusuario, pedidos_idpedidos, direccionDestino, direccionSalida, fecha}) {
    const [info] = await pool.query(`
    INSERT INTO envios (usuarios_idusuarios, pedidos_idpedidos, direccionDestino, direccionSalida, fecha) VALUES (?, ?, ?, ?, ?)`, 
    [usuario_idusuario, pedidos_idpedidos, direccionDestino, direccionSalida, fecha]);
    return obtenerPorId(info.insertId);    
}

//eliminar un envio
async function eliminar(idenvios) {
    const [info] = await pool.query(`DELETE FROM envios WHERE idenvios = ?`, [idenvios]);
    return info.affectedRows > 0;   
}

//Sección del status: pendiente

//siempre es necesario exportar las funciones para poder crear su api
module.exports = {listar, obtenerPorFecha, crear, eliminar};