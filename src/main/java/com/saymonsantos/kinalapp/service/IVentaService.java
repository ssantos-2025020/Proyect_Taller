package com.saymonsantos.kinalapp.service;

import com.saymonsantos.kinalapp.entity.Venta;
import java.util.List;
import java.util.Optional;

// Contrato que define los métodos del servicio
public interface IVentaService {

    List<Venta> listarTodos();

    Venta guardar(Venta venta);

    // Optional evita el NullPointerException
    Optional<Venta> buscarPorId(Integer id);

    Venta actualizar(Integer id, Venta venta);

    void eliminar(Integer id);

    boolean existePorId(Integer id);

    // Filtra por estado: 1 activo, 0 inactivo
    List<Venta> listarPorEstado(int estado);
}