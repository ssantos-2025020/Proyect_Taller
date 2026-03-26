package com.saymonsantos.kinalapp.service;

import com.saymonsantos.kinalapp.entity.Usuario;
import java.util.List;
import java.util.Optional;

// Contrato que define los métodos del servicio
public interface IUsuarioService {

    List<Usuario> listarTodos();

    Usuario guardar(Usuario usuario);

    // Optional evita el NullPointerException
    Optional<Usuario> buscarPorId(Integer id);

    Usuario actualizar(Integer id, Usuario usuario);

    void eliminar(Integer id);

    boolean existePorId(Integer id);

    // Filtra por estado: 1 activo, 0 inactivo
    List<Usuario> listarPorEstado(int estado);

    // Filtra por rol: ADMIN, VENDEDOR, etc.
    List<Usuario> listarPorRol(String rol);
}