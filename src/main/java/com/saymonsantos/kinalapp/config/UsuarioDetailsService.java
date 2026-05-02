package com.saymonsantos.kinalapp.config;

/**
 * KinalApp — Servicio de autenticación
 * Fundación Kinal | IN5AM | 2025
 * @author saymonsantos
 */

import com.saymonsantos.kinalapp.entity.Usuario;
import com.saymonsantos.kinalapp.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Usuario no encontrado: " + username
                ));

        // Solo usuarios activos pueden iniciar sesión
        if (usuario.getEstado() != 1) {
            throw new UsernameNotFoundException("Cuenta inactiva: " + username);
        }

        // Rol con prefijo ROLE_ requerido por Spring Security
        String rol = (usuario.getRol() != null && !usuario.getRol().isBlank())
                ? "ROLE_" + usuario.getRol().toUpperCase().trim()
                : "ROLE_USER";

        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority(rol)))
                .build();
    }
}