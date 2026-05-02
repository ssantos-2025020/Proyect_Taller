package com.saymonsantos.kinalapp.controller;

import com.saymonsantos.kinalapp.entity.Usuario;
import com.saymonsantos.kinalapp.service.IUsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class RegistroController {

    private final IUsuarioService usuarioService;

    public RegistroController(IUsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // ── Vista del formulario ──
    @GetMapping("/registro.html")
    public String vistaRegistro() {
        return "registro";
    }

    // ── Procesar registro ──
    @PostMapping("/registro")
    @ResponseBody
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            if (usuario.getUsername() == null || usuario.getUsername().isBlank())
                return ResponseEntity.badRequest().body("El username es obligatorio");
            if (usuario.getPassword() == null || usuario.getPassword().isBlank())
                return ResponseEntity.badRequest().body("La contraseña es obligatoria");
            if (usuario.getEmail() == null || usuario.getEmail().isBlank())
                return ResponseEntity.badRequest().body("El email es obligatorio");

            // Estado activo por defecto
            usuario.setEstado(1);

            // Si no trae rol válido, asignar USER por defecto
            if (usuario.getRol() == null || usuario.getRol().isBlank()) {
                usuario.setRol("USER");
            }

            Usuario nuevo = usuarioService.guardar(usuario);
            nuevo.setPassword(null); // no devolver contraseña
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar: " + e.getMessage());
        }
    }
}