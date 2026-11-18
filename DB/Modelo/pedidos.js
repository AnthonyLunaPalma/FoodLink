const pool = require('../DB_Localhost');

const COLUMNAS_PUBLICAS = 'idpedidos, descripcion, caducidad, evaluador, status_idstatus, tipos_idtipos';

//consultar todos los pedidos
async function listar() {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM pedidos ORDER BY idpedidos`); // Probabilodad de error al listar pedidos por id
}

//consultar por ID
async function obtenerPorId(idpedidos) {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM pedidos WHERE idpedidos = ?`, [idpedidos]);
    return filas[0];    
}

//Crear un pedido
async function crear({descripcion, caducidad, evaluador, tipos_idtipos}) {
    const [info] = await pool.query(`
    INSERT INTO pedidos (descripcion, caducidad, evaluador, tipos_idtipos) VALUES (?, ?, ?, ?)`, 
    [descripcion, caducidad, evaluador, tipos_idtipos]);
    return obtenerPorId(info.insertId);    
}

//eliminar un pedido
async function eliminar(idpedidos) {
    const [info] = await pool.query(`DELETE FROM pedidos WHERE idpedidos = ?`, [idpedidos]);
    return info.affectedRows > 0;   
}

//siempre es necesario exportar las funciones para poder crear su api
module.exports = {listar, obtenerPorId, crear, eliminar};