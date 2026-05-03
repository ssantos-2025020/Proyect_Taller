/**
 * VENTAS - CRUD COMPLETO
 */

import { Auth } from './auth.js';
import { toast, badge, mono, limpiarErrores, setError, setErrorWithMessage, cerrarModal, abrirModal, manejarErrorBD } from './utils.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

/**
 * Carga la tabla de ventas
 */
export async function cargarVentas() {
  const tbody = document.getElementById('body-ventas');
  if (!tbody) return;
  tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Cargando...</td>';

  try {
    const data = await apiGet('/ventas');
    if (!data.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No hay ventas registradas<html-resume-summary></html-resume-summary>';
      return;
    }

    tbody.innerHTML = data.map(v => {
      // Mostrar botones según el rol
      if (Auth.esAdmin()) {
        var botones = `
          <div class="actions-cell">
            <button class="btn btn-sm btn-edit" data-ver-venta='${JSON.stringify(v)}'>Ver</button>
            <button class="btn btn-sm btn-edit" data-editar-venta='${JSON.stringify(v)}'>Editar</button>
            <button class="btn btn-sm btn-danger" data-eliminar-venta="${v.codigoVenta}">Eliminar</button>
          </div>
        `;
      } else if (Auth.esUser()) {
        var botones = `
          <div class="actions-cell">
            <button class="btn btn-sm btn-edit" data-ver-venta='${JSON.stringify(v)}'>Ver</button>
          </div>
        `;
      } else {
        var botones = `<span style="color: var(--text3); font-size: 12px;">Solo lectura</span>`;
      }

      return `
        <tr>
          <td>${mono('#' + v.codigoVenta)}</td>
          <td>${v.fechaVenta}</td>
          <td>Q${parseFloat(v.total).toFixed(2)}</td>
          <td>${mono(v.cliente?.DPICliente || '—')}</td>
          <td>${mono('#' + (v.usuario?.codigoUsuario || '—'))}</td>
          <td>${badge(v.estado)}</td>
          <td>${botones}</td>
        </tr>
      `;
    }).join('');

    if (Auth.esAdmin()) {
      document.querySelectorAll('[data-editar-venta]').forEach(btn => {
        btn.addEventListener('click', () => {
          const data = JSON.parse(btn.getAttribute('data-editar-venta'));
          abrirModalVenta(data);
        });
      });
      document.querySelectorAll('[data-eliminar-venta]').forEach(btn => {
        btn.addEventListener('click', () => eliminarVenta(btn.getAttribute('data-eliminar-venta')));
      });
    }

    // Event listener para ver venta (todos los roles)
    document.querySelectorAll('[data-ver-venta]').forEach(btn => {
      btn.addEventListener('click', () => {
        const data = JSON.parse(btn.getAttribute('data-ver-venta'));
        abrirModalVenta(data);
      });
    });
  } catch (error) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="7">Error al conectar con la API</td></tr>';
  }
}

/**
 * Abre el modal para crear o editar una venta
 * @param {Object|null} data - Datos de la venta (null para nueva)
 */
export function abrirModalVenta(data = null) {
  const soloLectura = !Auth.esAdmin() && data !== null;

  limpiarErrores([['v-fecha', 'err-v-fecha'], ['v-total', 'err-v-total'], ['v-cliente', 'err-v-cliente'], ['v-usuario', 'err-v-usuario']]);

  const titulo = document.getElementById('titulo-venta');
  const fechaInput = document.getElementById('v-fecha');
  const totalInput = document.getElementById('v-total');
  const clienteInput = document.getElementById('v-cliente');
  const usuarioInput = document.getElementById('v-usuario');
  const estadoSelect = document.getElementById('v-estado');
  const editingId = document.getElementById('v-editing-id');
  const guardarBtn = document.getElementById('guardar-venta');

  if (titulo) titulo.textContent = soloLectura ? 'Ver venta' : (data ? 'Editar venta' : 'Nueva venta');

  if (fechaInput) {
    fechaInput.value = data ? data.fechaVenta : '';
    fechaInput.readOnly = soloLectura;
  }
  if (totalInput) {
    totalInput.value = data ? data.total : '';
    totalInput.readOnly = soloLectura;
  }
  if (clienteInput) {
    clienteInput.value = data ? (data.cliente?.DPICliente || '') : '';
    clienteInput.readOnly = soloLectura;
  }
  if (usuarioInput) {
    usuarioInput.value = data ? (data.usuario?.codigoUsuario || '') : '';
    usuarioInput.readOnly = soloLectura;
  }
  if (estadoSelect) {
    estadoSelect.value = data ? data.estado : '1';
    estadoSelect.disabled = soloLectura;
  }
  if (editingId) editingId.value = data ? data.codigoVenta : '';

  if (guardarBtn) guardarBtn.style.display = soloLectura ? 'none' : 'flex';

  abrirModal('modal-venta');
}

/**
 * Valida los campos del formulario de venta
 */
function validarVenta() {
  const fecha = document.getElementById('v-fecha')?.value || '';
  const total = parseFloat(document.getElementById('v-total')?.value || '0');
  const cliente = document.getElementById('v-cliente')?.value.trim() || '';
  const usuario = parseInt(document.getElementById('v-usuario')?.value || '0');
  let ok = true;

  if (!fecha) {
    ok = setErrorWithMessage('v-fecha', 'err-v-fecha', true, 'La fecha es obligatoria') && ok;
  } else {
    ok = setError('v-fecha', 'err-v-fecha', false) && ok;
  }

  if (isNaN(total) || total <= 0) {
    ok = setErrorWithMessage('v-total', 'err-v-total', true, 'El total debe ser un número mayor a 0') && ok;
  } else {
    ok = setError('v-total', 'err-v-total', false) && ok;
  }

  if (!/^\d{13}$/.test(cliente)) {
    ok = setErrorWithMessage('v-cliente', 'err-v-cliente', true, 'El DPI del cliente debe tener exactamente 13 dígitos') && ok;
  } else {
    ok = setError('v-cliente', 'err-v-cliente', false) && ok;
  }

  if (isNaN(usuario) || usuario < 1) {
    ok = setErrorWithMessage('v-usuario', 'err-v-usuario', true, 'Debe seleccionar un usuario válido') && ok;
  } else {
    ok = setError('v-usuario', 'err-v-usuario', false) && ok;
  }

  return ok;
}

/**
 * Guarda una venta (crea o actualiza)
 */
export async function guardarVenta() {
  if (!validarVenta()) {
    toast('Corrige los errores del formulario', 'error');
    return;
  }

  const editingId = document.getElementById('v-editing-id')?.value || '';
  const body = {
    fechaVenta: document.getElementById('v-fecha')?.value || '',
    total: parseFloat(document.getElementById('v-total')?.value || '0'),
    cliente: {
      DPICliente: document.getElementById('v-cliente')?.value.trim() || '',
      estado: 1
    },
    usuario: {
      codigoUsuario: parseInt(document.getElementById('v-usuario')?.value || '0'),
      estado: 1
    },
    estado: parseInt(document.getElementById('v-estado')?.value || '1')
  };

  try {
    if (editingId) {
      await apiPut(`/ventas/${editingId}`, body);
      toast('Venta actualizada correctamente');
    } else {
      await apiPost('/ventas', body);
      toast('Venta registrada correctamente');
    }
    cerrarModal('modal-venta');
    await cargarVentas();
  } catch (error) {
    console.error('Error en guardarVenta:', error);
    toast('Error al guardar la venta. Por favor, verifique los datos.', 'error');
  }
}

/**
 * Elimina una venta por su ID
 * @param {number} id - ID de la venta a eliminar
 */
export async function eliminarVenta(id) {
  if (!confirm(`¿Eliminar la venta #${id}?`)) return;
  try {
    await apiDelete(`/ventas/${id}`);
    toast('Venta eliminada');
    await cargarVentas();
  } catch (error) {
    console.error('Error eliminando venta:', error);
  }
}