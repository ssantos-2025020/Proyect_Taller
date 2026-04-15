/**
 * USUARIOS - CRUD COMPLETO (SOLO ADMIN)
 * Solo los usuarios con rol ADMIN pueden ver, crear, editar o eliminar usuarios
 */

import { Auth } from './auth.js';
import { toast, badge, mono, limpiarErrores, setError, cerrarModal, abrirModal } from './utils.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api.js';

/**
 * Carga la tabla de usuarios
 * Si el usuario no es ADMIN, muestra un mensaje de "Sin permisos"
 */
export async function cargarUsuarios() {
  const tbody = document.getElementById('body-usuarios');
  if (!tbody) return;

  // Solo ADMIN puede ver usuarios
  if (!Auth.esAdmin()) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">🔒 No tienes permisos para ver esta sección. Solo administradores.</td></tr>';
    const btnNuevo = document.getElementById('btn-nuevo-usuario');
    if (btnNuevo) btnNuevo.style.display = 'none';
    return;
  }

  const btnNuevo = document.getElementById('btn-nuevo-usuario');
  if (btnNuevo) btnNuevo.style.display = 'flex';

  tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Cargando...</td></tr>';

  try {
    const data = await apiGet('/usuarios');
    if (!data.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No hay usuarios registrados</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(u => `
      <tr>
        <td>${mono('#' + u.codigoUsuario)}</td>
        <td>${u.username}</td>
        <td style="color:var(--text2)">${u.email}</td>
        <td><span class="badge ${u.rol === 'ADMIN' ? 'badge-active' : 'badge-inactive'}">${u.rol}</span></td>
        <td>${badge(u.estado)}</td>
        <td>
          <div class="actions-cell">
            <button class="btn btn-sm btn-edit" data-editar-usuario='${JSON.stringify(u)}'>Editar</button>
            <button class="btn btn-sm btn-danger" data-eliminar-usuario="${u.codigoUsuario}">Eliminar</button>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('[data-editar-usuario]').forEach(btn => {
      btn.addEventListener('click', () => {
        const data = JSON.parse(btn.getAttribute('data-editar-usuario'));
        abrirModalUsuario(data);
      });
    });
    document.querySelectorAll('[data-eliminar-usuario]').forEach(btn => {
      btn.addEventListener('click', () => eliminarUsuario(btn.getAttribute('data-eliminar-usuario')));
    });
  } catch (error) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Error al conectar con la API</td></tr>';
  }
}

/**
 * Abre el modal para crear o editar un usuario
 * @param {Object|null} data - Datos del usuario (null para nuevo)
 */
export function abrirModalUsuario(data = null) {
  limpiarErrores([['u-username', 'err-u-username'], ['u-email', 'err-u-email'], ['u-password', 'err-u-password'], ['u-rol', 'err-u-rol']]);

  const titulo = document.getElementById('titulo-usuario');
  const usernameInput = document.getElementById('u-username');
  const emailInput = document.getElementById('u-email');
  const passwordInput = document.getElementById('u-password');
  const rolSelect = document.getElementById('u-rol');
  const estadoSelect = document.getElementById('u-estado');
  const editingId = document.getElementById('u-editing-id');
  const lblPassReq = document.getElementById('lbl-pass-req');

  if (titulo) titulo.textContent = data ? 'Editar usuario' : 'Nuevo usuario';
  if (usernameInput) usernameInput.value = data ? data.username : '';
  if (emailInput) emailInput.value = data ? data.email : '';
  if (passwordInput) passwordInput.value = '';
  if (rolSelect) rolSelect.value = data ? data.rol : '';
  if (estadoSelect) estadoSelect.value = data ? data.estado : '1';
  if (editingId) editingId.value = data ? data.codigoUsuario : '';
  if (lblPassReq) lblPassReq.style.display = data ? 'none' : 'inline';

  abrirModal('modal-usuario');
}

/**
 * Valida los campos del formulario de usuario
 */
function validarUsuario() {
  const user = document.getElementById('u-username')?.value.trim() || '';
  const email = document.getElementById('u-email')?.value.trim() || '';
  const pass = document.getElementById('u-password')?.value || '';
  const rol = document.getElementById('u-rol')?.value || '';
  const editing = document.getElementById('u-editing-id')?.value || '';
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let ok = true;

  ok = setError('u-username', 'err-u-username', user.length < 3 || /\s/.test(user)) && ok;
  ok = setError('u-email', 'err-u-email', !emailRx.test(email)) && ok;
  ok = setError('u-rol', 'err-u-rol', !rol) && ok;

  if (!editing) {
    ok = setError('u-password', 'err-u-password', pass.length < 6) && ok;
  } else if (pass.length > 0) {
    ok = setError('u-password', 'err-u-password', pass.length < 6) && ok;
  } else {
    setError('u-password', 'err-u-password', false);
  }
  return ok;
}

/**
 * Guarda un usuario (crea o actualiza)
 */
export async function guardarUsuario() {
  if (!validarUsuario()) {
    toast('Corrige los errores del formulario', 'error');
    return;
  }

  const editingId = document.getElementById('u-editing-id')?.value || '';
  const pass = document.getElementById('u-password')?.value || '';

  const body = {
    username: document.getElementById('u-username')?.value.trim() || '',
    email: document.getElementById('u-email')?.value.trim() || '',
    rol: document.getElementById('u-rol')?.value || '',
    estado: parseInt(document.getElementById('u-estado')?.value || '1')
  };

  if (pass) body.password = pass;

  try {
    if (editingId) {
      await apiPut(`/usuarios/${editingId}`, body);
      toast('Usuario actualizado correctamente');
    } else {
      await apiPost('/usuarios', body);
      toast('Usuario creado correctamente');
    }
    cerrarModal('modal-usuario');
    await cargarUsuarios();
  } catch (error) {
    console.error('Error guardando usuario:', error);
  }
}

/**
 * Elimina un usuario por su ID
 * @param {number} id - ID del usuario a eliminar
 */
export async function eliminarUsuario(id) {
  if (!confirm(`¿Eliminar el usuario #${id}?`)) return;
  try {
    await apiDelete(`/usuarios/${id}`);
    toast('Usuario eliminado');
    await cargarUsuarios();
  } catch (error) {
    console.error('Error eliminando usuario:', error);
  }
}