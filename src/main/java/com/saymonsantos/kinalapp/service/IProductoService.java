package com.saymonsantos.kinalapp.service;

import com.saymonsantos.kinalapp.entity.Producto;
import java.util.List;
import java.util.Optional;

// Contrato que define los métodos del servicio
public interface IProductoService {

    List<Producto> listarTodos();

    Producto guardar(Producto producto);

    // Optional evita el NullPointerException
    Optional<Producto> buscarPorId(Integer id);

    Producto actualizar(Integer id, Producto producto);

    void eliminar(Integer id);

    boolean existePorId(Integer id);

    // Filtra por estado: 1 activo, 0 inactivo
    List<Producto> listarPorEstado(int estado);
}