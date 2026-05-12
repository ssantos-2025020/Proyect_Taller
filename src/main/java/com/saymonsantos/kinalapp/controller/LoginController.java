package com.saymonsantos.kinalapp.controller;

import com.saymonsantos.kinalapp.entity.Usuario;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.HashMap;
import java.util.Map;

// Controlador para manejar las páginas HTML del login y registro
@Controller
public class LoginController {

    // Mapea la URL /login.html a la plantilla login.html
    @GetMapping("/login.html")
    public String login() {
        return "login";
    }

    // Mapea la URL /index.html a la plantilla index.html
    @GetMapping("/index.html")
    public String index() {
        return "index";
    }

    // Endpoint para obtener datos del usuario autenticado
    @GetMapping("/api/usuario-actual")
    @ResponseBody
    public Map<String, Object> getUsuarioActual(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> response = new HashMap<>();

        if (userDetails != null) {
            // Extraer el rol del usuario (quitar el prefijo ROLE_)
            String rol = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                    .orElse("USER");

            response.put("username", userDetails.getUsername());
            response.put("rol", rol);
            response.put("autenticado", true);
        } else {
            response.put("autenticado", false);
        }

        return response;
    }

    // Endpoint de éxito de login para redirección con datos
    @GetMapping("/login-success")
    @ResponseBody
    public Map<String, Object> loginSuccess(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> response = new HashMap<>();

        if (userDetails != null) {
            String rol = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                    .orElse("USER");

            response.put("username", userDetails.getUsername());
            response.put("rol", rol);
            response.put("success", true);
        }

        return response;
    }

}