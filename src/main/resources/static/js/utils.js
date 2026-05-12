/**
 * UTILIDADES GENERALES
 * Funciones reutilizables en toda la aplicación
 */

import { BASE_URL } from './config.js';

/**
 * Muestra una notificación emergente (toast)
 * @param {string} msg - Mensaje a mostrar
 * @param {string} type - Tipo: 'success' o 'error'
 */
export function toast(msg, type = 'success') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/**
 * Devuelve una etiqueta HTML para el estado (Activo/Inactivo)
 * @param {number} estado - 1 para activo, 0 para inactivo
 */
export function badge(estado) {
  return estado == 1
    ? '<span class="badge badge-active">Activo</span>'
    : '<span class="badge badge-inactive">Inactivo</span>';
}

/**
 * Formatea un texto con fuente monoespaciada
 * @param {string} txt - Texto a formatear
 */
export function mono(txt) {
  return `<span style="font-family:'DM Mono',monospace;font-size:12px">${txt}</span>`;
}

/**
 * Filtra una tabla por texto de búsqueda
 * @param {string} tableId - ID de la tabla
 * @param {string} val - Texto a buscar
 */
export function filterTable(tableId, val) {
  const table = document.getElementById(tableId);
  if (!table) return;
  document.querySelectorAll('#' + tableId + ' tbody tr').forEach(r => {
    r.style.display = r.textContent.toLowerCase().includes(val.toLowerCase()) ? '' : 'none';
  });
}

/**
 * Marca o desmarca un error en un campo de formulario
 * @param {string} inputId - ID del input
 * @param {string} errId - ID del mensaje de error
 * @param {boolean} showError - true para mostrar error, false para ocultar
 */
export function setError(inputId, errId, showError) {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (!inp || !err) return true;
  if (showError) {
    inp.classList.add('error');
    err.classList.add('visible');
  } else {
    inp.classList.remove('error');
    err.classList.remove('visible');
  }
  return !showError;
}

/**
 * Establece un error con mensaje personalizado
 * @param {string} inputId - ID del input
 * @param {string} errId - ID del mensaje de error
 * @param {boolean} showError - true para mostrar error, false para ocultar
 * @param {string} message - Mensaje de error personalizado
 */
export function setErrorWithMessage(inputId, errId, showError, message = '') {
  const inp = document.getElementById(inputId);
  const err = document.getElementById(errId);
  if (!inp || !err) return true;
  if (showError) {
    inp.classList.add('error');
    err.classList.add('visible');
    if (message) err.textContent = message;
  } else {
    inp.classList.remove('error');
    err.classList.remove('visible');
  }
  return !showError;
}

/**
 * Maneja errores de base de datos y muestra mensajes amigables
 * @param {Error} error - Error capturado
 * @param {string} entidad - Nombre de la entidad para mensajes personalizados
 * @param {string} campo - Campo específico que causó el error (opcional)
 */
export function manejarErrorBD(error, entidad = '', campo = '') {
  console.error(`Error guardando ${entidad}:`, error);

  const errorMsg = (error.message || '') + (error.toString() || '');

  // Manejo específico de errores de base de datos
  if (errorMsg.includes('foreign key constraint') || errorMsg.includes('ConstraintViolationException')) {
    if (errorMsg.includes('usuarios_codigo_usuario') || errorMsg.includes('usuarios')) {
      toast(`Error en el campo "${campo || 'ID Usuario'}": El ID de usuario no existe. Por favor, seleccione un usuario válido.`, 'error');
    } else if (errorMsg.includes('clientes_dpi_cliente') || errorMsg.includes('clientes')) {
      toast(`Error en el campo "${campo || 'DPI Cliente'}": El DPI del cliente no existe en el sistema. Por favor, verifique el DPI ingresado.`, 'error');
    } else if (errorMsg.includes('productos_codigo_producto') || errorMsg.includes('productos')) {
      toast(`Error en el campo "${campo || 'Código Producto'}": El código del producto no existe. Por favor, seleccione un producto válido.`, 'error');
    } else if (errorMsg.includes('ventas_codigo_venta') || errorMsg.includes('ventas')) {
      toast(`Error en el campo "${campo || 'Código Venta'}": El código de venta no existe. Por favor, seleccione una venta válida.`, 'error');
    } else {
      if (campo && campo !== 'referencia') {
        toast(`Error de referencia: El dato ingresado en "${campo}" no existe en el sistema.`, 'error');
      } else {
        toast('Error de referencia: Uno de los datos ingresados no existe en el sistema. Por favor, verifique los campos de referencia.', 'error');
      }
    }
  } else if (errorMsg.includes('DataIntegrityViolationException')) {
    if (campo) {
      toast(`Error de integridad de datos en "${campo}". Verifique que todos los datos sean correctos.`, 'error');
    } else {
      toast('Error de integridad de datos. Verifique que todos los datos sean correctos.', 'error');
    }
  } else if (errorMsg.includes('Duplicate entry')) {
    if (campo) {
      toast(`Error: El valor en "${campo}" ya existe en el sistema.`, 'error');
    } else {
      toast('Error: Este registro ya existe en el sistema.', 'error');
    }
  } else if (error.status === 400) {
    if (campo) {
      toast(`Error en el campo "${campo}": Datos inválidos. Por favor, verifique la información.`, 'error');
    } else {
      toast('Error en los datos enviados. Por favor, verifique la información.', 'error');
    }
  } else if (error.status === 403) {
    toast('No tiene permisos para realizar esta acción.', 'error');
  } else if (error.status === 404) {
    toast('El recurso solicitado no fue encontrado.', 'error');
  } else if (error.status === 500) {
    toast('Error interno del servidor. Intente nuevamente más tarde.', 'error');
  } else {
    if (campo) {
      toast(`Error al guardar ${entidad}. Verifique el campo "${campo}".`, 'error');
    } else {
      toast(`Error al guardar ${entidad}. Intente nuevamente.`, 'error');
    }
  }
}

/**
 * Limpia todos los errores de un formulario
 * @param {Array} pares - Array de pares [inputId, errorId]
 */
export function limpiarErrores(pares) {
  pares.forEach(([i, e]) => setError(i, e, false));
}

/**
 * Cierra un modal por su ID
 * @param {string} id - ID del modal
 */
export function cerrarModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('open');
}

/**
 * Abre un modal por su ID
 * @param {string} id - ID del modal
 */
export function abrirModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('open');
}

/**
 * Inicializa el reloj en la barra lateral
 */
export function initClock() {
  setInterval(() => {
    const clock = document.getElementById('clock');
    if (clock) {
      clock.textContent = new Date().toLocaleTimeString('es-GT', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
  }, 1000);
}

/**
 * Inicializa la fecha en el dashboard
 */
export function initDate() {
  const fechaEl = document.getElementById('dash-fecha');
  if (fechaEl) {
    fechaEl.textContent = new Date().toLocaleDateString('es-GT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}