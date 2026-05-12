/**
 * LOGIN - PÁGINA DE INICIO DE SESIÓN
 * Valida credenciales contra GET /usuarios
 */

import { Auth } from './auth.js';

const BASE = 'http://localhost:9000';

/**
 * Muestra u oculta error en un campo específico
 */
function setError(inputId, errorId, hayError) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (hayError) {
    input.classList.add('is-invalid');
    error.classList.add('visible');
  } else {
    input.classList.remove('is-invalid');
    error.classList.remove('visible');
  }
  return !hayError;
}

/**
 * Limpia todos los errores del formulario
 */
function limpiarErrores() {
  ['l-username', 'l-password'].forEach(id => {
    document.getElementById(id)?.classList.remove('is-invalid');
  });
  document.querySelectorAll('.ka-field-error').forEach(e => e.classList.remove('visible'));
}

/**
 * Muestra un mensaje de error global
 */
function mostrarError(msg) {
  const el = document.getElementById('login-error-global');
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

/**
 * Oculta el mensaje de error global
 */
function ocultarError() {
  const el = document.getElementById('login-error-global');
  if (el) el.style.display = 'none';
}

/**
 * Activa/desactiva el estado de carga del botón
 */
function setLoading(loading) {
  const btn = document.getElementById('btn-login');
  const spin = document.getElementById('login-spinner');
  if (btn) btn.disabled = loading;
  if (spin) spin.style.display = loading ? 'inline-block' : 'none';
  const btnText = btn?.querySelector('#btn-login-text');
  if (btnText) btnText.textContent = loading ? 'Ingresando...' : 'Ingresar';
}

/**
 * Valida que los campos no estén vacíos
 */
function validarFormulario() {
  const username = document.getElementById('l-username')?.value.trim() || '';
  const password = document.getElementById('l-password')?.value || '';
  let ok = true;
  if (!setError('l-username', 'err-l-username', username.length < 1)) ok = false;
  if (!setError('l-password', 'err-l-password', password.length < 1)) ok = false;
  return ok;
}

/**
 * Intenta iniciar sesión con las credenciales ingresadas
 */
export async function iniciarSesion() {
  limpiarErrores();
  ocultarError();

  if (!validarFormulario()) return;

  const username = document.getElementById('l-username')?.value.trim() || '';
  const password = document.getElementById('l-password')?.value || '';

  setLoading(true);

  try {
    // Obtener todos los usuarios del backend
    const response = await fetch(`${BASE}/usuarios`);
    if (!response.ok) throw new Error('No se pudo conectar con el servidor');

    const usuarios = await response.json();

    // Buscar usuario que coincida con username, password y estado activo
    const usuario = usuarios.find(u =>
      u.username === username &&
      u.password === password &&
      u.estado == 1
    );

    if (!usuario) {
      mostrarError('Usuario o contraseña incorrectos, o cuenta inactiva.');
      setLoading(false);
      const card = document.getElementById('login-card');
      if (card) {
        card.classList.add('shake');
        setTimeout(() => card.classList.remove('shake'), 500);
      }
      return;
    }

    // Guardar sesión (sin guardar la contraseña)
    const sesion = {
      codigoUsuario: usuario.codigoUsuario,
      username: usuario.username,
      email: usuario.email,
      rol: usuario.rol,
      estado: usuario.estado
    };
    Auth.setUsuario(sesion);

    // Animación de éxito y redirección
    const card = document.getElementById('login-card');
    if (card) card.classList.add('success-flash');
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 600);

  } catch (error) {
    console.error('Error en login:', error);
    mostrarError('No se pudo conectar con la API en localhost:9000. ¿Está corriendo el servidor?');
    setLoading(false);
  }
}

// Configurar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Si ya hay sesión, redirigir al dashboard
  if (Auth.estaLogueado()) {
    window.location.href = '/index.html';
    return;
  }

  // Evento del botón de login
  const btn = document.getElementById('btn-login');
  if (btn) {
    btn.addEventListener('click', iniciarSesion);
  }

  // Validación en tiempo real
  const usernameInput = document.getElementById('l-username');
  const passwordInput = document.getElementById('l-password');
  const loginForm = document.getElementById('login-form');
  const toggleBtn = document.getElementById('btn-toggle-pass');

  if (usernameInput) {
    usernameInput.addEventListener('input', function () {
      setError('l-username', 'err-l-username', this.value.trim().length < 1);
      ocultarError();
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      setError('l-password', 'err-l-password', this.value.length < 1);
      ocultarError();
    });
  }

  // Enter en el formulario
  if (loginForm) {
    loginForm.addEventListener('keydown', e => {
      if (e.key === 'Enter') iniciarSesion();
    });
  }

  // Mostrar/ocultar contraseña
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const input = document.getElementById('l-password');
      const icon = document.getElementById('toggle-icon');
      if (input && icon) {
        if (input.type === 'password') {
          input.type = 'text';
          icon.textContent = '🙈';
        } else {
          input.type = 'password';
          icon.textContent = '👁';
        }
      }
    });
  }
});