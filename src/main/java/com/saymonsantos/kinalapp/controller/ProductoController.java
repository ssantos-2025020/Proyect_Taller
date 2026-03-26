package com.saymonsantos.kinalapp.controller;

import com.saymonsantos.kinalapp.entity.Producto;
import com.saymonsantos.kinalapp.service.IProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/productos")
public class ProductoController {

    // Inyectamos la interfaz, no la clase directamente
    private final IProductoService productoService;

    public ProductoController(IProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public ResponseEntity<List<Producto>> listar() {
        return ResponseEntity.ok(productoService.listarTodos());
        // 200 OK
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarPorId(@PathVariable Integer id) {
        return productoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        // 200 OK o 404 NOT FOUND
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Producto producto) {
        try {
            Producto nuevo = productoService.guardar(producto);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
            // 201 CREATED
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
            // 400 BAD REQUEST
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Producto producto) {
        try {
            if (!productoService.existePorId(id)) {
                return ResponseEntity.notFound().build();
                // 404 NOT FOUND
            }
            Producto actualizado = productoService.actualizar(id, producto);
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
            if (!productoService.existePorId(id)) {
                return ResponseEntity.notFound().build();
                // 404 NOT FOUND
            }
            productoService.eliminar(id);
            return ResponseEntity.noContent().build();
            // 204 NO CONTENT
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Lista productos activos
    @GetMapping("/activos")
    public ResponseEntity<List<Producto>> listarActivos() {
        return ResponseEntity.ok(productoService.listarPorEstado(1));
    }
}