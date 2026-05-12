package com.saymonsantos.kinalapp.repository;

import com.saymonsantos.kinalapp.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    // Spring genera el SQL automáticamente: SELECT * FROM usuarios WHERE username = ?
    Optional<Usuario> findByUsername(String username);

    // Listar usuarios por estado (activo/inactivo)
    java.util.List<Usuario> findByEstado(int estado);

    // Listar usuarios por rol
    java.util.List<Usuario> findByRol(String rol);
}