/**
 * PRODUCTOS - CRUD COMPLETO
 */

import { Auth } from './auth.js';
import { toast, badge, mono, limpiarErrores, setError, setErrorWithMessage, cerrarModal, abrirModal, manejarErrorBD } from './utils.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

/**
 * Carga la tabla de productos
 */
export async function cargarProductos() {
  const tbody = document.getElementById('body-productos');
  if (!tbody) return;
  tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Cargando...</td></tr>';

  try {
    const data = await apiGet('/productos');
    if (!data.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No hay productos registrados</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(p => {
      // Mostrar botones según el rol
      if (Auth.esAdmin()) {
        var botones = `
          <div class="actions-cell">
            <button class="btn btn-sm btn-edit" data-ver-producto='${JSON.stringify(p)}'>Ver</button>
            <button class="btn btn-sm btn-edit" data-editar-producto='${JSON.stringify(p)}'>Editar</button>
            <button class="btn btn-sm btn-danger" data-eliminar-producto="${p.codigoProducto}">Eliminar</button>
          </div>
        `;
      } else if (Auth.esUser()) {
        var botones = `
          <div class="actions-cell">
            <button class="btn btn-sm btn-edit" data-ver-producto='${JSON.stringify(p)}'>Ver</button>
          </div>
        `;
      } else {
        var botones = `<span style="color: var(--text3); font-size: 12px;">Solo lectura</span>`;
      }

      return `
        <tr>
          <td>${mono('#' + p.codigoProducto)}</td>
          <td>${p.nombreProducto}</td>
          <td>Q${parseFloat(p.precio).toFixed(2)}</td>
          <td>${p.stock}</td>
          <td>${badge(p.estado)}</td>
          <td>${botones}</td>
        </tr>
      `;
    }).join('');

    if (Auth.esAdmin()) {
      document.querySelectorAll('[data-editar-producto]').forEach(btn => {
        btn.addEventListener('click', () => {
          const data = JSON.parse(btn.getAttribute('data-editar-producto'));
          abrirModalProducto(data);
        });
      });
      document.querySelectorAll('[data-eliminar-producto]').forEach(btn => {
        btn.addEventListener('click', () => eliminarProducto(btn.getAttribute('data-eliminar-producto')));
      });
    }

    // Event listener para ver producto (todos los roles)
    document.querySelectorAll('[data-ver-producto]').forEach(btn => {
      btn.addEventListener('click', () => {
        const data = JSON.parse(btn.getAttribute('data-ver-producto'));
        abrirModalProducto(data);
      });
    });
  } catch (error) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Error al conectar con la API</td></tr>';
  }
}

/**
 * Abre el modal para crear o editar un producto
 * @param {Object|null} data - Datos del producto (null para nuevo)
 */
export function abrirModalProducto(data = null) {
  const soloLectura = !Auth.esAdmin() && data !== null;

  limpiarErrores([['p-nombre', 'err-p-nombre'], ['p-precio', 'err-p-precio'], ['p-stock', 'err-p-stock']]);

  const titulo = document.getElementById('titulo-producto');
  const nombreInput = document.getElementById('p-nombre');
  const precioInput = document.getElementById('p-precio');
  const stockInput = document.getElementById('p-stock');
  const estadoSelect = document.getElementById('p-estado');
  const editingId = document.getElementById('p-editing-id');
  const guardarBtn = document.getElementById('guardar-producto');

  if (titulo) titulo.textContent = soloLectura ? 'Ver producto' : (data ? 'Editar producto' : 'Nuevo producto');

  if (nombreInput) {
    nombreInput.value = data ? data.nombreProducto : '';
    nombreInput.readOnly = soloLectura;
  }
  if (precioInput) {
    precioInput.value = data ? data.precio : '';
    precioInput.readOnly = soloLectura;
  }
  if (stockInput) {
    stockInput.value = data ? data.stock : '';
    stockInput.readOnly = soloLectura;
  }
  if (estadoSelect) {
    estadoSelect.value = data ? data.estado : '1';
    estadoSelect.disabled = soloLectura;
  }
  if (editingId) editingId.value = data ? data.codigoProducto : '';

  if (guardarBtn) guardarBtn.style.display = soloLectura ? 'none' : 'flex';

  abrirModal('modal-producto');
}

/**
 * Valida los campos del formulario de producto
 */
function validarProducto() {
  const nombre = document.getElementById('p-nombre')?.value.trim() || '';
  const precio = parseFloat(document.getElementById('p-precio')?.value || '0');
  const stock = parseInt(document.getElementById('p-stock')?.value || '0');
  let ok = true;

  if (nombre.length < 2) {
    ok = setErrorWithMessage('p-nombre', 'err-p-nombre', true, 'El nombre debe tener al menos 2 caracteres') && ok;
  } else {
    ok = setError('p-nombre', 'err-p-nombre', false) && ok;
  }

  if (isNaN(precio) || precio <= 0) {
    ok = setErrorWithMessage('p-precio', 'err-p-precio', true, 'El precio debe ser un número mayor a 0') && ok;
  } else {
    ok = setError('p-precio', 'err-p-precio', false) && ok;
  }

  if (isNaN(stock) || stock < 0) {
    ok = setErrorWithMessage('p-stock', 'err-p-stock', true, 'El stock debe ser un número mayor o igual a 0') && ok;
  } else {
    ok = setError('p-stock', 'err-p-stock', false) && ok;
  }

  return ok;
}

/**
 * Guarda un producto (crea o actualiza)
 */
export async function guardarProducto() {
  if (!validarProducto()) {
    toast('Corrige los errores del formulario', 'error');
    return;
  }

  const editingId = document.getElementById('p-editing-id')?.value || '';
  const body = {
    nombreProducto: document.getElementById('p-nombre')?.value.trim() || '',
    precio: parseFloat(document.getElementById('p-precio')?.value || '0'),
    stock: parseInt(document.getElementById('p-stock')?.value || '0'),
    estado: parseInt(document.getElementById('p-estado')?.value || '1')
  };

  try {
    if (editingId) {
      await apiPut(`/productos/${editingId}`, body);
      toast('Producto actualizado correctamente');
    } else {
      await apiPost('/productos', body);
      toast('Producto creado correctamente');
    }
    cerrarModal('modal-producto');
    await cargarProductos();
  } catch (error) {
    console.error('Error guardando producto:', error);
    toast('Error al guardar el producto. Por favor, verifique los datos.', 'error');
  }
}

/**
 * Elimina un producto por su ID
 * @param {number} id - ID del producto a eliminar
 */
export async function eliminarProducto(id) {
  if (!confirm(`¿Eliminar el producto #${id}?`)) return;
  try {
    await apiDelete(`/productos/${id}`);
    toast('Producto eliminado');
    await cargarProductos();
  } catch (error) {
    console.error('Error eliminando producto:', error);
    toast('Error al eliminar el producto. Intente nuevamente.', 'error');
  }
}