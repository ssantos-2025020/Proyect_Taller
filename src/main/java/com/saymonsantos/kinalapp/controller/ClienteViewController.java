package com.saymonsantos.kinalapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ClienteViewController {

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("titulo", "KinalApp - Dashboard");
        return "index";
    }

    @GetMapping("/vistas/clientes")
    public String clientes(Model model) {
        model.addAttribute("seccion", "clientes");
        return "index";
    }

    @GetMapping("/vistas/productos")
    public String productos(Model model) {
        model.addAttribute("seccion", "productos");
        return "index";
    }

    @GetMapping("/vistas/ventas")
    public String ventas(Model model) {
        model.addAttribute("seccion", "ventas");
        return "index";
    }

    @GetMapping("/vistas/detalle")
    public String detalle(Model model) {
        model.addAttribute("seccion", "detalle");
        return "index";
    }

    @GetMapping("/vistas/usuarios")
    public String usuarios(Model model) {
        model.addAttribute("seccion", "usuarios");
        return "index";
    }
}