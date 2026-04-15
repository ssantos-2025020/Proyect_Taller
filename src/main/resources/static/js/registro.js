/**
 * REGISTRO - CREAR CUENTA NUEVA
 * Permite registrarse como USER o ADMIN (con clave secreta)
 */

const BASE = 'http://localhost:9000';

// Clave secreta para registrarse como ADMIN (cámbiala por la que quieras)
const CLAVE_ADMIN = 'Kinal2025Admin';

/**
 * Muestra u oculta error en un campo específico
 */
function setError(inputId, errorId, hayError, mensaje = null) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (hayError) {
    input.classList.add('is-invalid');
    error.classList.add('visible');
    if (mensaje) error.textContent = mensaje;
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
  ['r-username', 'r-email', 'r-password', 'r-admin-key'].forEach(id => {
    document.getElementById(id)?.classList.remove('is-invalid');
  });
  document.querySelectorAll('.ka-field-error').forEach(e => e.classList.remove('visible'));
}

/**
 * Muestra un mensaje de error global
 */
function mostrarError(msg) {
  const el = document.getElementById('register-error-global');
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

/**
 * Oculta el mensaje de error global
 */
function ocultarError() {
  const el = document.getElementById('register-error-global');
  if (el) el.style.display = 'none';
}

/**
 * Activa/desactiva el estado de carga del botón
 */
function setLoading(loading) {
  const btn = document.getElementById('btn-register');
  const spin = document.getElementById('register-spinner');
  if (btn) btn.disabled = loading;
  if (spin) spin.style.display = loading ? 'inline-block' : 'none';
  const btnText = btn?.querySelector('#btn-register-text');
  if (btnText) btnText.textContent = loading ? 'Registrando...' : 'Registrarse';
}

/**
 * Valida que los campos del formulario sean correctos
 */
function validarFormulario() {
  const username = document.getElementById('r-username')?.value.trim() || '';
  const email = document.getElementById('r-email')?.value.trim() || '';
  const password = document.getElementById('r-password')?.value || '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let ok = true;

  if (!setError('r-username', 'err-r-username', username.length < 3)) ok = false;
  if (!setError('r-email', 'err-r-email', !emailRegex.test(email))) ok = false;
  if (!setError('r-password', 'err-r-password', password.length < 6)) ok = false;

  return ok;
}

/**
 * Registra un nuevo usuario en el sistema
 */
export async function registrarUsuario() {
  limpiarErrores();
  ocultarError();

  if (!validarFormulario()) return;

  const username = document.getElementById('r-username')?.value.trim() || '';
  const email = document.getElementById('r-email')?.value.trim() || '';
  const password = document.getElementById('r-password')?.value || '';
  const adminKey = document.getElementById('r-admin-key')?.value || '';

  setLoading(true);

  try {
    // Determinar el rol según la clave secreta
    let rol = 'USER';
    if (adminKey === CLAVE_ADMIN) {
      rol = 'ADMIN';
    } else if (adminKey !== '') {
      setError('r-admin-key', 'err-r-admin-key', true, '⚠ Clave de administrador incorrecta');
      setLoading(false);
      return;
    }

    const body = {
      username: username,
      email: email,
      password: password,
      rol: rol,
      estado: 1
    };

    const response = await fetch(`${BASE}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Error al crear usuario');
    }

    // Éxito: animación y redirección al login
    const card = document.getElementById('register-card');
    if (card) card.classList.add('success-flash');

    setTimeout(() => {
      window.location.href = '/login.html';
    }, 600);

  } catch (error) {
    console.error('Error en registro:', error);
    mostrarError(error.message || 'No se pudo conectar con el servidor. ¿Está corriendo el backend?');
    setLoading(false);
  }
}

// Configurar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Si ya hay sesión, redirigir al dashboard
  const tieneSesion = sessionStorage.getItem('ka_usuario');
  if (tieneSesion) {
    window.location.href = '/index.html';
    return;
  }

  // Evento del botón de registro
  const btn = document.getElementById('btn-register');
  if (btn) {
    btn.addEventListener('click', registrarUsuario);
  }

  // Validación en tiempo real
  const usernameInput = document.getElementById('r-username');
  const emailInput = document.getElementById('r-email');
  const passwordInput = document.getElementById('r-password');
  const adminKeyInput = document.getElementById('r-admin-key');
  const registerForm = document.getElementById('register-form');
  const toggleBtn = document.getElementById('btn-toggle-pass');

  if (usernameInput) {
    usernameInput.addEventListener('input', function () {
      setError('r-username', 'err-r-username', this.value.trim().length < 3);
      ocultarError();
    });
  }

  if (emailInput) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    emailInput.addEventListener('input', function () {
      setError('r-email', 'err-r-email', !emailRegex.test(this.value.trim()));
      ocultarError();
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('input', function () {
      setError('r-password', 'err-r-password', this.value.length < 6);
      ocultarError();
    });
  }

  if (adminKeyInput) {
    adminKeyInput.addEventListener('input', function () {
      setError('r-admin-key', 'err-r-admin-key', false);
      ocultarError();
    });
  }

  // Enter en el formulario
  if (registerForm) {
    registerForm.addEventListener('keydown', e => {
      if (e.key === 'Enter') registrarUsuario();
    });
  }

  // Mostrar/ocultar contraseña
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const input = document.getElementById('r-password');
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
