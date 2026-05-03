/**
 * CLIENTES - CRUD COMPLETO
 */

import { Auth } from './auth.js';
import { toast, badge, mono, limpiarErrores, setError, setErrorWithMessage, cerrarModal, abrirModal, manejarErrorBD } from './utils.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

/**
 * Carga la tabla de clientes
 */
export async function cargarClientes() {
  const tbody = document.getElementById('body-clientes');
  if (!tbody) return;
  tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Cargando...</td></tr>';

  try {
    const data = await apiGet('/clientes');
    if (!data.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No hay clientes registrados</td></tr>';
      return;
    }

    // Renderizar cada fila
    tbody.innerHTML = data.map(c => {
      // Mostrar botones según el rol
      if (Auth.esAdmin()) {
        var botones = `
          <div class="actions-cell">
            <button class="btn btn-sm btn-edit" data-ver-cliente='${JSON.stringify(c)}'>Ver</button>
            <button class="btn btn-sm btn-edit" data-editar-cliente='${JSON.stringify(c)}'>Editar</button>
            <button class="btn btn-sm btn-danger" data-eliminar-cliente="${c.DPICliente}">Eliminar</button>
          </div>
        `;
      } else if (Auth.esUser()) {
        var botones = `
          <div class="actions-cell">
            <button class="btn btn-sm btn-edit" data-ver-cliente='${JSON.stringify(c)}'>Ver</button>
          </div>
        `;
      } else {
        var botones = `<span style="color: var(--text3); font-size: 12px;">Solo lectura</span>`;
      }

      return `
        <tr>
          <td>${mono(c.DPICliente)}</td>
          <td>${c.nombreCliente}</td>
          <td>${c.apellidoCliente}</td>
          <td style="color:var(--text2)">${c.direccion}</td>
          <td>${badge(c.estado)}</td>
          <td>${botones}</td>
        </tr>
      `;
    }).join('');

    // Solo bindear eventos si es ADMIN
    if (Auth.esAdmin()) {
      document.querySelectorAll('[data-editar-cliente]').forEach(btn => {
        btn.addEventListener('click', () => {
          const data = JSON.parse(btn.getAttribute('data-editar-cliente'));
          abrirModalCliente(data);
        });
      });
      document.querySelectorAll('[data-eliminar-cliente]').forEach(btn => {
        btn.addEventListener('click', () => eliminarCliente(btn.getAttribute('data-eliminar-cliente')));
      });
    }

    // Event listener para ver cliente (todos los roles)
    document.querySelectorAll('[data-ver-cliente]').forEach(btn => {
      btn.addEventListener('click', () => {
        const data = JSON.parse(btn.getAttribute('data-ver-cliente'));
        abrirModalCliente(data);
      });
    });
  } catch (error) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Error al conectar con la API</td></tr>';
  }
}

/**
 * Abre el modal para crear o editar un cliente
 * @param {Object|null} data - Datos del cliente (null para nuevo)
 */
export function abrirModalCliente(data = null) {
  // Si no es ADMIN y hay datos (edición), mostrar solo lectura
  const soloLectura = !Auth.esAdmin() && data !== null;

  limpiarErrores([['c-dpi', 'err-c-dpi'], ['c-nombre', 'err-c-nombre'], ['c-apellido', 'err-c-apellido'], ['c-direccion', 'err-c-direccion']]);

  const titulo = document.getElementById('titulo-cliente');
  const dpiInput = document.getElementById('c-dpi');
  const nombreInput = document.getElementById('c-nombre');
  const apellidoInput = document.getElementById('c-apellido');
  const direccionInput = document.getElementById('c-direccion');
  const estadoSelect = document.getElementById('c-estado');
  const editingDpi = document.getElementById('c-editing-dpi');
  const guardarBtn = document.getElementById('guardar-cliente');

  if (titulo) titulo.textContent = soloLectura ? 'Ver cliente' : (data ? 'Editar cliente' : 'Nuevo cliente');

  if (dpiInput) {
    dpiInput.value = data ? data.DPICliente : '';
    dpiInput.readOnly = soloLectura || !!data;
  }
  if (nombreInput) {
    nombreInput.value = data ? data.nombreCliente : '';
    nombreInput.readOnly = soloLectura;
  }
  if (apellidoInput) {
    apellidoInput.value = data ? data.apellidoCliente : '';
    apellidoInput.readOnly = soloLectura;
  }
  if (direccionInput) {
    direccionInput.value = data ? data.direccion : '';
    direccionInput.readOnly = soloLectura;
  }
  if (estadoSelect) {
    estadoSelect.value = data ? data.estado : '1';
    estadoSelect.disabled = soloLectura;
  }
  if (editingDpi) editingDpi.value = data ? data.DPICliente : '';

  // Ocultar botón guardar si es solo lectura
  if (guardarBtn) guardarBtn.style.display = soloLectura ? 'none' : 'flex';

  abrirModal('modal-cliente');
}

/**
 * Valida los campos del formulario de cliente
 */
function validarCliente() {
  const dpi = document.getElementById('c-dpi')?.value.trim() || '';
  const nombre = document.getElementById('c-nombre')?.value.trim() || '';
  const ape = document.getElementById('c-apellido')?.value.trim() || '';
  const dir = document.getElementById('c-direccion')?.value.trim() || '';
  const editing = document.getElementById('c-editing-dpi')?.value || '';
  let ok = true;

  if (!editing) {
    if (!/^\d{13}$/.test(dpi)) {
      ok = setErrorWithMessage('c-dpi', 'err-c-dpi', true, 'El DPI debe tener exactamente 13 dígitos') && ok;
    } else {
      ok = setError('c-dpi', 'err-c-dpi', false) && ok;
    }
  }

  if (nombre.length < 2) {
    ok = setErrorWithMessage('c-nombre', 'err-c-nombre', true, 'El nombre debe tener al menos 2 caracteres') && ok;
  } else {
    ok = setError('c-nombre', 'err-c-nombre', false) && ok;
  }

  if (ape.length < 2) {
    ok = setErrorWithMessage('c-apellido', 'err-c-apellido', true, 'El apellido debe tener al menos 2 caracteres') && ok;
  } else {
    ok = setError('c-apellido', 'err-c-apellido', false) && ok;
  }

  if (dir.length < 5) {
    ok = setErrorWithMessage('c-direccion', 'err-c-direccion', true, 'La dirección debe tener al menos 5 caracteres') && ok;
  } else {
    ok = setError('c-direccion', 'err-c-direccion', false) && ok;
  }

  return ok;
}

/**
 * Guarda un cliente (crea o actualiza)
 */
export async function guardarCliente() {
  if (!validarCliente()) {
    toast('Corrige los errores del formulario', 'error');
    return;
  }

  const editingDpi = document.getElementById('c-editing-dpi')?.value || '';
  const body = {
    DPICliente: document.getElementById('c-dpi')?.value.trim() || '',
    nombreCliente: document.getElementById('c-nombre')?.value.trim() || '',
    apellidoCliente: document.getElementById('c-apellido')?.value.trim() || '',
    direccion: document.getElementById('c-direccion')?.value.trim() || '',
    estado: parseInt(document.getElementById('c-estado')?.value || '1')
  };

  try {
    if (editingDpi) {
      await apiPut(`/clientes/${editingDpi}`, body);
      toast('Cliente actualizado correctamente');
    } else {
      await apiPost('/clientes', body);
      toast('Cliente creado correctamente');
    }
    cerrarModal('modal-cliente');
    await cargarClientes();
  } catch (error) {
    console.error('Error guardando cliente:', error);
    toast('Error al guardar el cliente. Por favor, verifique los datos.', 'error');
  }
}

/**
 * Elimina un cliente por su DPI
 * @param {string} dpi - DPI del cliente a eliminar
 */
export async function eliminarCliente(dpi) {
  if (!confirm(`¿Eliminar el cliente con DPI ${dpi}?`)) return;
  try {
    await apiDelete(`/clientes/${dpi}`);
    toast('Cliente eliminado');
    await cargarClientes();
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    toast('Error al eliminar el cliente. Intente nuevamente.', 'error');
  }
}