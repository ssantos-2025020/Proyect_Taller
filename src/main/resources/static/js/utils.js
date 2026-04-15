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