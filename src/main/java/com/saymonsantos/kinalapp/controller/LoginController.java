package com.saymonsantos.kinalapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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

}