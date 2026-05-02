package com.saymonsantos.kinalapp.service;

import com.saymonsantos.kinalapp.entity.Usuario;
import com.saymonsantos.kinalapp.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService implements IUsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> buscarPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public List<Usuario> listarPorEstado(int estado) {
        return usuarioRepository.findByEstado(estado);
    }

    @Override
    public List<Usuario> listarPorRol(String rol) {
        return usuarioRepository.findByRol(rol);
    }

    @Override
    public boolean existePorId(Integer id) {
        return usuarioRepository.existsById(id);
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        if (usuario.getUsername() == null || usuario.getUsername().isBlank())
            throw new IllegalArgumentException("El username es obligatorio");
        if (usuario.getPassword() == null || usuario.getPassword().isBlank())
            throw new IllegalArgumentException("La contraseña es obligatoria");
        if (usuario.getEmail() == null || usuario.getEmail().isBlank())
            throw new IllegalArgumentException("El email es obligatorio");
        if (usuario.getRol() == null || usuario.getRol().isBlank())
            throw new IllegalArgumentException("El rol es obligatorio");

        // Contraseña en texto plano — BCrypt se implementará en siguiente versión
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario actualizar(Integer id, Usuario datos) {
        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + id));

        existente.setUsername(datos.getUsername());
        existente.setEmail(datos.getEmail());
        existente.setRol(datos.getRol());
        existente.setEstado(datos.getEstado());

        // Solo actualizar contraseña si se envía una nueva
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            existente.setPassword(datos.getPassword());
        }

        return usuarioRepository.save(existente);
    }

    @Override
    public void eliminar(Integer id) {
        usuarioRepository.deleteById(id);
    }
}