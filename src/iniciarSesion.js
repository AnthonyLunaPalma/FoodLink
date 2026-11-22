document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    const mensajeLogin = document.getElementById('mensaje-login');

    if (!formLogin) {
        console.error("No se encontró el formulario con ID 'form-login'");
        return;
    }

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        const cuentaInput = document.getElementById('login-cuenta');
        const contrasenaInput = document.getElementById('login-contrasena');

        if (!cuentaInput || !contrasenaInput) {
            console.error("Faltan campos de entrada en el HTML.");
            return;
        }

        const cuenta = cuentaInput.value;
        const contrasena = contrasenaInput.value;

        try {
            const respuesta = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cuenta, contrasena })
            });

            const resultado = await respuesta.json();

            if (respuesta.ok) {
                mensajeLogin.style.color = 'green';
                mensajeLogin.textContent = resultado.mensaje;
            } else {
                mensajeLogin.style.color = 'red';
                mensajeLogin.textContent = resultado.error || 'Credenciales incorrectas.';
            }

        } catch (error) {
            console.error('Error de conexión:', error);
            mensajeLogin.style.color = 'red';
            mensajeLogin.textContent = 'Error al conectar con el servidor.';
        }
    });
});