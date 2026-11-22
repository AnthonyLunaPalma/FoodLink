//Aqui va la funcion de validar correo
function validarCorreo(correo){
    if (typeof correo !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}

//Aqui va la funcion de validar boleta
function validarBoleta(boleta){
    if (typeof boleta !== 'string') return false;
    return /^\d{10}$/.test(boleta.trim());
}

//Aqui va la funcion de validar contraseña
function validarContrasena(contrasena){
    if (typeof contrasena !== 'string') return false;
    return contrasena.length >= 8;
}

module.exports = {validarCorreo, validarBoleta, validarContrasena};