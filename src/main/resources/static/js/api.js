/**
 * API - FUNCIONES GENÉRICAS PARA CONSUMIR EL BACKEND
 * Todas las funciones devuelven Promesas
 */

import { BASE_URL } from './config.js';
import { toast } from './utils.js';

/**
 * Petición GET para obtener datos
 * @param {string} endpoint - Ruta del endpoint (ej: '/clientes')
 */
export async function apiGet(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('GET error:', error);
    toast('Error al conectar con el servidor', 'error');
    return [];
  }
}

/**
 * Petición POST para crear un nuevo registro
 * @param {string} endpoint - Ruta del endpoint
 * @param {Object} data - Datos a enviar en el cuerpo de la petición
 */
export async function apiPost(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Petición PUT para actualizar un registro existente
 * @param {string} endpoint - Ruta del endpoint (incluye ID)
 * @param {Object} data - Datos actualizados
 */
export async function apiPut(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Petición DELETE para eliminar un registro
 * @param {string} endpoint - Ruta del endpoint (incluye ID)
 */
export async function apiDelete(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}`);
    }
    return true;
  } catch (error) {
    throw error;
  }
}