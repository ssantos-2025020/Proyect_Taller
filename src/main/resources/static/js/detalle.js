/**
 * DETALLE VENTA - CRUD CON RESTRICCIONES
 * No se puede eliminar detalles por integridad contable
 * Los usuarios normales solo pueden ver, los ADMIN pueden crear
 */

import { Auth } from './auth.js';
import { toast, mono, limpiarErrores, setError, cerrarModal, abrirModal } from './utils.js';
import { apiGet, apiPost, apiPut } from './api.js';

let detalleData = [];

/**
 * Carga los detalles de venta
 * Controla la visibilidad del botón "Nuevo detalle" según el rol
 */
export async function cargarDetalle() {
  const tbody = document.getElementById('body-detalle');
  if (!tbody) return;

  // Solo ADMIN puede crear nuevos detalles
  const btnNuevoDetalle = document.getElementById('btn-nuevo-detalle');
  if (btnNuevoDetalle) {
    if (!Auth.esAdmin()) {
      btnNuevoDetalle.style.display = 'none';
    } else {
      btnNuevoDetalle.style.display = 'flex';
    }
  }

  tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Cargando...</td></tr>';

  try {
    const data = await apiGet('/detalle-ventas');
    detalleData = data;
    renderDetalle(data);
  } catch (error) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Error al conectar con la API</td></tr>';
  }
}

/**
 * Filtra los detalles por ID de venta
 * @param {number} ventaId - ID de la venta a filtrar
 */
export async function filtrarPorVenta(ventaId) {
  if (!ventaId) {
    renderDetalle(detalleData);
    return;
  }
  try {
    const data = await apiGet(`/detalle-ventas/venta/${ventaId}`);
    renderDetalle(data);
  } catch (error) {
    renderDetalle([]);
  }
}

/**
 * Renderiza la tabla de detalles de venta
 * @param {Array} data - Lista de detalles
 */
function renderDetalle(data) {
  const tbody = document.getElementById('body-detalle');
  if (!tbody) return;

  if (!data.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No hay detalles registrados</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(dv => `
    <tr>
      <td>${mono('#' + dv.codigoDetalleVenta)}</td>
      <td>${mono('#' + (dv.venta?.codigoVenta || '—'))}</td>
      <td>${mono('#' + (dv.producto?.codigoProducto || '—'))}</td>
      <td>${dv.cantidad}</td>
      <td>Q${parseFloat(dv.precioUnitario).toFixed(2)}</td>
      <td>Q${parseFloat(dv.subtotal).toFixed(2)}</td>
      <td>
        <div class="actions-cell">
          <button class="btn btn-sm btn-edit" data-ver-detalle='${JSON.stringify(dv)}'>Ver</button>
        </div>
      </td>
    </tr>
  `).join('');

  // Evento para ver detalle (siempre visible)
  document.querySelectorAll('[data-ver-detalle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const data = JSON.parse(btn.getAttribute('data-ver-detalle'));
      verModalDetalle(data);
    });
  });
}

/**
 * Muestra el modal con los detalles en modo solo lectura
 * @param {Object} data - Datos del detalle a mostrar
 */
function verModalDetalle(data) {
  limpiarErrores([['dv-venta', 'err-dv-venta'], ['dv-producto', 'err-dv-producto'], ['dv-cantidad', 'err-dv-cantidad'], ['dv-precio', 'err-dv-precio']]);

  const titulo = document.getElementById('titulo-detalle');
  const ventaInput = document.getElementById('dv-venta');
  const productoInput = document.getElementById('dv-producto');
  const cantidadInput = document.getElementById('dv-cantidad');
  const precioInput = document.getElementById('dv-precio');
  const subtotalInput = document.getElementById('dv-subtotal');
  const guardarBtn = document.getElementById('guardar-detalle');
  const cancelarBtn = document.querySelector('#modal-detalle .btn[data-modal="modal-detalle"]');

  if (titulo) titulo.textContent = 'Ver detalle de venta';

  // Llenar campos con datos (todos en modo lectura)
  if (ventaInput) {
    ventaInput.value = data?.venta?.codigoVenta || '';
    ventaInput.readOnly = true;
  }
  if (productoInput) {
    productoInput.value = data?.producto?.codigoProducto || '';
    productoInput.readOnly = true;
  }
  if (cantidadInput) {
    cantidadInput.value = data?.cantidad || '';
    cantidadInput.readOnly = true;
  }
  if (precioInput) {
    precioInput.value = data?.precioUnitario || '';
    precioInput.readOnly = true;
  }
  if (subtotalInput) {
    subtotalInput.value = data?.subtotal?.toFixed(2) || '';
    subtotalInput.readOnly = true;
  }

  // Ocultar botón guardar
  if (guardarBtn) guardarBtn.style.display = 'none';
  if (cancelarBtn) cancelarBtn.textContent = 'Cerrar';

  abrirModal('modal-detalle');
}

/**
 * Abre el modal para crear un nuevo detalle (solo ADMIN)
 * @param {Object|null} data - No se usa, se mantiene por compatibilidad
 */
export function abrirModalDetalle(data = null) {
  limpiarErrores([['dv-venta', 'err-dv-venta'], ['dv-producto', 'err-dv-producto'], ['dv-cantidad', 'err-dv-cantidad'], ['dv-precio', 'err-dv-precio']]);

  const titulo = document.getElementById('titulo-detalle');
  const ventaInput = document.getElementById('dv-venta');
  const productoInput = document.getElementById('dv-producto');
  const cantidadInput = document.getElementById('dv-cantidad');
  const precioInput = document.getElementById('dv-precio');
  const subtotalInput = document.getElementById('dv-subtotal');
  const guardarBtn = document.getElementById('guardar-detalle');
  const editingId = document.getElementById('dv-editing-id');
  const cancelarBtn = document.querySelector('#modal-detalle .btn[data-modal="modal-detalle"]');

  if (titulo) titulo.textContent = 'Nuevo detalle de venta';

  // Limpiar campos (modo edición)
  if (ventaInput) {
    ventaInput.value = '';
    ventaInput.readOnly = false;
  }
  if (productoInput) {
    productoInput.value = '';
    productoInput.readOnly = false;
  }
  if (cantidadInput) {
    cantidadInput.value = '';
    cantidadInput.readOnly = false;
  }
  if (precioInput) {
    precioInput.value = '';
    precioInput.readOnly = false;
  }
  if (subtotalInput) subtotalInput.value = '';
  if (editingId) editingId.value = '';

  // Mostrar botón guardar
  if (guardarBtn) guardarBtn.style.display = 'flex';
  if (cancelarBtn) cancelarBtn.textContent = 'Cancelar';

  abrirModal('modal-detalle');
}

/**
 * Inicializa el cálculo automático del subtotal
 */
function initSubtotalAuto() {
  const cantidadInput = document.getElementById('dv-cantidad');
  const precioInput = document.getElementById('dv-precio');
  const subtotalInput = document.getElementById('dv-subtotal');

  if (cantidadInput && precioInput && subtotalInput) {
    const updateSubtotal = () => {
      const cant = parseFloat(cantidadInput.value) || 0;
      const precio = parseFloat(precioInput.value) || 0;
      subtotalInput.value = (cant * precio).toFixed(2);
    };
    cantidadInput.addEventListener('input', updateSubtotal);
    precioInput.addEventListener('input', updateSubtotal);
  }
}

/**
 * Valida los campos del formulario de detalle
 */
function validarDetalle() {
  const venta = parseInt(document.getElementById('dv-venta')?.value || '0');
  const producto = parseInt(document.getElementById('dv-producto')?.value || '0');
  const cantidad = parseInt(document.getElementById('dv-cantidad')?.value || '0');
  const precio = parseFloat(document.getElementById('dv-precio')?.value || '0');
  let ok = true;

  ok = setError('dv-venta', 'err-dv-venta', isNaN(venta) || venta < 1) && ok;
  ok = setError('dv-producto', 'err-dv-producto', isNaN(producto) || producto < 1) && ok;
  ok = setError('dv-cantidad', 'err-dv-cantidad', isNaN(cantidad) || cantidad < 1) && ok;
  ok = setError('dv-precio', 'err-dv-precio', isNaN(precio) || precio <= 0) && ok;
  return ok;
}

/**
 * Guarda un nuevo detalle (solo ADMIN puede crear)
 */
export async function guardarDetalle() {
  if (!validarDetalle()) {
    toast('Corrige los errores del formulario', 'error');
    return;
  }

  const cantidad = parseInt(document.getElementById('dv-cantidad')?.value || '0');
  const precio = parseFloat(document.getElementById('dv-precio')?.value || '0');

  const body = {
    ventasCodigoVenta: parseInt(document.getElementById('dv-venta')?.value || '0'),
    productosCodigoProducto: parseInt(document.getElementById('dv-producto')?.value || '0'),
    cantidad: cantidad,
    precioUnitario: precio,
    subtotal: parseFloat((cantidad * precio).toFixed(2))
  };

  try {
    await apiPost('/detalle-ventas', body);
    toast('Detalle creado correctamente');
    cerrarModal('modal-detalle');
    await cargarDetalle();
  } catch (error) {
    console.error('Error guardando detalle:', error);
  }
}

/**
 * Inicializa los eventos del módulo de detalles
 */
export function initDetalleEvents() {
  initSubtotalAuto();

  // Resetear modal cuando se cierra
  const modal = document.getElementById('modal-detalle');
  if (modal) {
    const observer = new MutationObserver(() => {
      if (!modal.classList.contains('open')) {
        const guardarBtn = document.getElementById('guardar-detalle');
        const cancelarBtn = document.querySelector('#modal-detalle .btn[data-modal="modal-detalle"]');
        if (guardarBtn) guardarBtn.style.display = 'flex';
        if (cancelarBtn) cancelarBtn.textContent = 'Cancelar';
      }
    });
    observer.observe(modal, { attributes: true });
  }
}