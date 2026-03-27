package com.saymonsantos.kinalapp.service;

import com.saymonsantos.kinalapp.entity.DetalleVenta;
import java.util.List;
import java.util.Optional;

// Contrato que define los métodos del servicio
public interface IDetalleVentaService {

    List<DetalleVenta> listarTodos();

    DetalleVenta guardar(DetalleVenta detalleVenta);

    // Optional evita el NullPointerException
    Optional<DetalleVenta> buscarPorId(Integer id);

    DetalleVenta actualizar(Integer id, DetalleVenta detalleVenta);

    void eliminar(Integer id);

    boolean existePorId(Integer id);

    // Trae todos los detalles de una venta específica
    List<DetalleVenta> listarPorVenta(Integer ventaId);
}