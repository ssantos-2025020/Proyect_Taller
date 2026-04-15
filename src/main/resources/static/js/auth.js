/**
 * AUTH - MANEJO DE SESIÓN Y ROLES
 * Guarda el usuario en sessionStorage (se borra al cerrar el navegador)
 */

const Auth = {
  /**
   * Guarda el usuario en sessionStorage
   * @param {Object} usuario - Datos del usuario (sin password)
   */
  setUsuario(usuario) {
    sessionStorage.setItem('ka_usuario', JSON.stringify(usuario));
  },

  /**
   * Obtiene el usuario guardado
   * @returns {Object|null} Usuario o null si no hay sesión
   */
  getUsuario() {
    const data = sessionStorage.getItem('ka_usuario');
    return data ? JSON.parse(data) : null;
  },

  /**
   * Verifica si hay una sesión activa
   * @returns {boolean}
   */
  estaLogueado() {
    return !!this.getUsuario();
  },

  /**
   * Obtiene el rol del usuario actual
   * @returns {string|null} 'ADMIN', 'USER' o null
   */
  getRol() {
    const usuario = this.getUsuario();
    return usuario ? usuario.rol : null;
  },

  /**
   * Verifica si el usuario es ADMIN
   * @returns {boolean}
   */
  esAdmin() {
    return this.getRol() === 'ADMIN';
  },

  /**
   * Verifica si el usuario es USER
   * @returns {boolean}
   */
  esUser() {
    const rol = this.getRol();
    return rol === 'USER';
  },

  /**
   * Cierra la sesión y redirige al login
   */
  cerrarSesion() {
    sessionStorage.removeItem('ka_usuario');
    window.location.href = '/login.html';
  },

  /**
   * Protege una página: si no hay sesión, redirige al login
   * Excluye las páginas de login y registro
   */
  protegerPagina() {
    if (!this.estaLogueado() &&
        !window.location.pathname.includes('login.html') &&
        !window.location.pathname.includes('registro.html')) {
      window.location.href = '/login.html';
    }
  },

  /**
   * Muestra el nombre y rol del usuario en el topbar
   * Busca los elementos con ID 'usuario-nombre' y 'usuario-rol'
   */
  mostrarUsuario() {
    const usuario = this.getUsuario();
    if (!usuario) return;

    const elNombre = document.getElementById('usuario-nombre');
    if (elNombre) elNombre.textContent = usuario.username;

    const elRol = document.getElementById('usuario-rol');
    if (elRol) {
      const rolClass = usuario.rol === 'ADMIN' ? 'badge-active' : 'badge-inactive';
      elRol.innerHTML = `<span class="badge ${rolClass}" style="font-size: 10px;">${usuario.rol}</span>`;
    }
  }
};

export { Auth };