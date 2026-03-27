package com.saymonsantos.kinalapp.controller;

import com.saymonsantos.kinalapp.entity.DetalleVenta;
import com.saymonsantos.kinalapp.service.IDetalleVentaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/detalle-ventas")
public class DetalleVentaController {

    // Inyectamos la interfaz, no la clase directamente
    private final IDetalleVentaService detalleVentaService;

    public DetalleVentaController(IDetalleVentaService detalleVentaService) {
        this.detalleVentaService = detalleVentaService;
    }

    @GetMapping
    public ResponseEntity<List<DetalleVenta>> listar() {
        return ResponseEntity.ok(detalleVentaService.listarTodos());
        // 200 OK
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleVenta> buscarPorId(@PathVariable Integer id) {
        return detalleVentaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        // 200 OK o 404 NOT FOUND
    }

    // Lista todos los detalles de una venta específica
    @GetMapping("/venta/{ventaId}")
    public ResponseEntity<List<DetalleVenta>> listarPorVenta(@PathVariable Integer ventaId) {
        return ResponseEntity.ok(detalleVentaService.listarPorVenta(ventaId));
        // 200 OK
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody DetalleVenta detalleVenta) {
        try {
            DetalleVenta nuevo = detalleVentaService.guardar(detalleVenta);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
            // 201 CREATED
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
            // 400 BAD REQUEST
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody DetalleVenta detalleVenta) {
        try {
            if (!detalleVentaService.existePorId(id)) {
                return ResponseEntity.notFound().build();
                // 404 NOT FOUND
            }
            DetalleVenta actualizado = detalleVentaService.actualizar(id, detalleVenta);
            return ResponseEntity.ok(actualizado);
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
            if (!detalleVentaService.existePorId(id)) {
                return ResponseEntity.notFound().build();
                // 404 NOT FOUND
            }
            detalleVentaService.eliminar(id);
            return ResponseEntity.noContent().build();
            // 204 NO CONTENT
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}