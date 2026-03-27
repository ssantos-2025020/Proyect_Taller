package com.saymonsantos.kinalapp.controller;

import com.saymonsantos.kinalapp.entity.Venta;
import com.saymonsantos.kinalapp.service.IVentaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ventas")
public class VentaController {

    // Inyectamos la interfaz, no la clase directamente
    private final IVentaService ventaService;

    public VentaController(IVentaService ventaService) {
        this.ventaService = ventaService;
    }

    @GetMapping
    public ResponseEntity<List<Venta>> listar() {
        return ResponseEntity.ok(ventaService.listarTodos());
        // 200 OK
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venta> buscarPorId(@PathVariable Integer id) {
        return ventaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        // 200 OK o 404 NOT FOUND
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Venta venta) {
        try {
            Venta nueva = ventaService.guardar(venta);
            return new ResponseEntity<>(nueva, HttpStatus.CREATED);
            // 201 CREATED
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
            // 400 BAD REQUEST
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Venta venta) {
        try {
            if (!ventaService.existePorId(id)) {
                return ResponseEntity.notFound().build();
                // 404 NOT FOUND
            }
            Venta actualizada = ventaService.actualizar(id, venta);
            return ResponseEntity.ok(actualizada);
            // 200 OK
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
            // 400 BAD REQUEST
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        try {
            if (!ventaService.existePorId(id)) {
                return ResponseEntity.notFound().build();
                // 404 NOT FOUND
            }
            ventaService.eliminar(id);
            return ResponseEntity.noContent().build();
            // 204 NO CONTENT
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Lista ventas activas
    @GetMapping("/activas")
    public ResponseEntity<List<Venta>> listarActivas() {
        return ResponseEntity.ok(ventaService.listarPorEstado(1));
    }
}