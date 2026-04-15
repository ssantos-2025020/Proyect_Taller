/**
 * MAIN - PUNTO DE ENTRADA PRINCIPAL
 * Inicializa la aplicación, protege rutas y configura eventos globales
 */

import { Auth } from './auth.js';
import { initClock, initDate, filterTable } from './utils.js';
import { cargarDashboard } from './dashboard.js';
import { cargarClientes, guardarCliente, abrirModalCliente } from './clientes.js';
import { cargarProductos, guardarProducto, abrirModalProducto } from './productos.js';
import { cargarVentas, guardarVenta, abrirModalVenta } from './ventas.js';
import { cargarDetalle, filtrarPorVenta, guardarDetalle, abrirModalDetalle, initDetalleEvents } from './detalle.js';
import { cargarUsuarios, guardarUsuario, abrirModalUsuario } from './usuarios.js';
import { cerrarModal } from './utils.js';

// Proteger página (si no hay sesión, redirige al login)
Auth.protegerPagina();

// Mostrar nombre y rol del usuario en el topbar
Auth.mostrarUsuario();

// Variable para la navegación
let currentSection = 'dashboard';

/**
 * Cambia entre secciones del dashboard
 * @param {string} section - Nombre de la sección (dashboard, clientes, etc.)
 * @param {HTMLElement} btnElement - Botón que activó el cambio
 */
window.showSection = function(section, btnElement) {
  // Ocultar todas las secciones
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Mostrar la sección seleccionada
  const secToShow = document.getElementById(`sec-${section}`);
  if (secToShow) secToShow.classList.add('active');

  // Actualizar botones activos
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  // Actualizar título de la página
  const titles = {
    dashboard: 'Dashboard',
    clientes: 'Clientes',
    productos: 'Productos',
    ventas: 'Ventas',
    detalle: 'Detalle de Ventas',
    usuarios: 'Usuarios'
  };
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = titles[section] || section;

  currentSection = section;

  // Cargar datos según la sección
  switch(section) {
    case 'dashboard':
      cargarDashboard();
      break;
    case 'clientes':
      cargarClientes();
      break;
    case 'productos':
      cargarProductos();
      break;
    case 'ventas':
      cargarVentas();
      break;
    case 'detalle':
      cargarDetalle();
      break;
    case 'usuarios':
      cargarUsuarios();
      break;
  }
};

/**
 * Configura los eventos de búsqueda en las tablas
 */
function initSearchEvents() {
  const searches = [
    { id: 'search-clientes', table: 'tbl-clientes' },
    { id: 'search-productos', table: 'tbl-productos' },
    { id: 'search-ventas', table: 'tbl-ventas' },
    { id: 'search-detalle', table: 'tbl-detalle' },
    { id: 'search-usuarios', table: 'tbl-usuarios' }
  ];

  searches.forEach(s => {
    const input = document.getElementById(s.id);
    if (input) {
      input.addEventListener('input', (e) => filterTable(s.table, e.target.value));
    }
  });

  // Filtro especial para detalle por ID de venta
  const filterVenta = document.getElementById('filter-venta-id');
  if (filterVenta) {
    filterVenta.addEventListener('input', (e) => filtrarPorVenta(e.target.value));
  }
}

/**
 * Configura los eventos de los botones de los modales
 */
function initModalButtons() {
  // Botones de cerrar modal
  document.querySelectorAll('.modal-close, .btn[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      if (modalId) cerrarModal(modalId);
    });
  });

  // Cerrar modal al hacer clic fuera
  document.querySelectorAll('.modal-bg').forEach(bg => {
    bg.addEventListener('click', (e) => {
      if (e.target === bg) bg.classList.remove('open');
    });
  });

  // Botones de guardar
  const btnGuardarCliente = document.getElementById('guardar-cliente');
  if (btnGuardarCliente) btnGuardarCliente.addEventListener('click', guardarCliente);

  const btnGuardarProducto = document.getElementById('guardar-producto');
  if (btnGuardarProducto) btnGuardarProducto.addEventListener('click', guardarProducto);

  const btnGuardarVenta = document.getElementById('guardar-venta');
  if (btnGuardarVenta) btnGuardarVenta.addEventListener('click', guardarVenta);

  const btnGuardarDetalle = document.getElementById('guardar-detalle');
  if (btnGuardarDetalle) btnGuardarDetalle.addEventListener('click', guardarDetalle);

  const btnGuardarUsuario = document.getElementById('guardar-usuario');
  if (btnGuardarUsuario) btnGuardarUsuario.addEventListener('click', guardarUsuario);

  // Botones de nuevo registro
  const btnNuevoCliente = document.getElementById('btn-nuevo-cliente');
  if (btnNuevoCliente) btnNuevoCliente.addEventListener('click', () => abrirModalCliente(null));

  const btnNuevoProducto = document.getElementById('btn-nuevo-producto');
  if (btnNuevoProducto) btnNuevoProducto.addEventListener('click', () => abrirModalProducto(null));

  const btnNuevaVenta = document.getElementById('btn-nueva-venta');
  if (btnNuevaVenta) btnNuevaVenta.addEventListener('click', () => abrirModalVenta(null));

  const btnNuevoDetalle = document.getElementById('btn-nuevo-detalle');
  if (btnNuevoDetalle) btnNuevoDetalle.addEventListener('click', () => abrirModalDetalle(null));

  const btnNuevoUsuario = document.getElementById('btn-nuevo-usuario');
  if (btnNuevoUsuario) btnNuevoUsuario.addEventListener('click', () => abrirModalUsuario(null));
}

/**
 * Configura los eventos de navegación del sidebar
 */
function initNavEvents() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = btn.getAttribute('data-section');
      if (section) window.showSection(section, btn);
    });
  });
}

/**
 * Inicializa toda la aplicación
 */
async function init() {
  // Inicializar utilidades
  initClock();
  initDate();
  initDetalleEvents();

  // Configurar eventos
  initNavEvents();
  initSearchEvents();
  initModalButtons();

  // Cargar sección inicial (Dashboard)
  const activeBtn = document.querySelector('.nav-item.active');
  if (activeBtn) {
    const section = activeBtn.getAttribute('data-section');
    if (section) window.showSection(section, activeBtn);
  } else {
    window.showSection('dashboard', document.querySelector('.nav-item'));
  }

  // Evento cerrar sesión
  const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {
      Auth.cerrarSesion();
    });
  }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);