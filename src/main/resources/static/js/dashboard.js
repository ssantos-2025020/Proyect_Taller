/**
 * DASHBOARD - ESTADÍSTICAS
 * Carga y muestra los conteos de cada módulo en las tarjetas
 */

import { BASE_URL } from './config.js';
import { apiGet } from './api.js';
import { Auth } from './auth.js';

/**
 * Carga las estadísticas del dashboard
 * Obtiene la cantidad de registros de cada módulo y los muestra
 */
export async function cargarDashboard() {
  try {
    // Determinar si cargar usuarios según el rol
    const isAdmin = Auth.esAdmin();

    // Realizar peticiones según el rol
    const requests = [
      apiGet('/clientes'),
      apiGet('/productos'),
      apiGet('/ventas'),
      apiGet('/detalle-ventas')
    ];

    // Solo cargar usuarios si es ADMIN
    if (isAdmin) {
      requests.push(apiGet('/usuarios'));
    }

    const results = await Promise.all(requests);

    // Extraer resultados (usuarios puede no estar presente)
    const [clientes, productos, ventas, detalles, usuarios] = isAdmin ? results : [...results, null];

    // Actualizar los valores en las tarjetas del dashboard
    const dClientes = document.getElementById('d-clientes');
    const dProductos = document.getElementById('d-productos');
    const dVentas = document.getElementById('d-ventas');
    const dDetalles = document.getElementById('d-detalles');
    const dUsuarios = document.getElementById('d-usuarios');

    if (dClientes) dClientes.textContent = clientes.length || 0;
    if (dProductos) dProductos.textContent = productos.length || 0;
    if (dVentas) dVentas.textContent = ventas.length || 0;
    if (dDetalles) dDetalles.textContent = detalles.length || 0;
    if (dUsuarios) dUsuarios.textContent = isAdmin && usuarios ? usuarios.length : 0;
  } catch (error) {
    console.error('Error cargando dashboard:', error);
  }
}