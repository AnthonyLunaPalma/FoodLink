const formRegistro = document.getElementById('form-registro');
const mensajeRegistro = document.getElementById('mensaje-registro');

formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const rol = document.getElementById('registro-rol').value;
    const nombre = document.getElementById('registro-nombre').value;
    const correo = document.getElementById('registro-correo').value; // <--- Capturamos el correo
    const cuenta = document.getElementById('registro-cuenta').value;
    const contrasena = document.getElementById('registro-contrasena').value;
    const confirmar = document.getElementById('registro-confirmar').value;

    // Validación local del correo usando expresiones regulares
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo.trim())) {
        mensajeRegistro.style.color = 'red';
        mensajeRegistro.textContent = 'Por favor, ingresa un correo electrónico válido.';
        return;
    }

    if (contrasena !== confirmar) {
        mensajeRegistro.style.color = 'red';
        mensajeRegistro.textContent = 'Las contraseñas no coinciden.';
        return; 
    }

    try {
        const respuesta = await fetch('http://localhost:3000/api/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rol, nombre, correo, cuenta, contrasena }) // <--- Enviamos el correo
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            mensajeRegistro.style.color = 'green';
            mensajeRegistro.textContent = resultado.mensaje; 
            formRegistro.reset(); 
        } else {
            mensajeRegistro.style.color = 'red';
            mensajeRegistro.textContent = resultado.error || 'No se pudo registrar.';
        }

    } catch (error) {
        console.error('Error de conexión:', error);
        mensajeRegistro.style.color = 'red';
        mensajeRegistro.textContent = 'Error al conectar con el servidor.';
    }
});