package com.saymonsantos.kinalapp.service;

import com.saymonsantos.kinalapp.entity.Venta;
import com.saymonsantos.kinalapp.repository.VentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class VentaService implements IVentaService {

    private final VentaRepository ventaRepository;

    // Spring inyecta el repositorio automáticamente
    public VentaService(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venta> listarTodos() {
        // SELECT * FROM Ventas
        return ventaRepository.findAll();
    }

    @Override
    public Venta guardar(Venta venta) {
        validarVenta(venta);
        // Si no tiene estado, se activa por defecto
        if (venta.getEstado() == 0) {
            venta.setEstado(1);
        }
        return ventaRepository.save(venta);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Venta> buscarPorId(Integer id) {
        return ventaRepository.findById(id);
    }

    @Override
    public Venta actualizar(Integer id, Venta venta) {
        if (!ventaRepository.existsById(id)) {
            throw new RuntimeException("Venta no encontrada con ID: " + id);
        }
        venta.setCodigoVenta(id);
        validarVenta(venta);
        return ventaRepository.save(venta);
    }

    @Override
    public void eliminar(Integer id) {
        if (!ventaRepository.existsById(id)) {
            throw new RuntimeException("Venta no encontrada con ID: " + id);
        }
        // DELETE FROM Ventas WHERE codigo_venta = ?
        ventaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePorId(Integer id) {
        return ventaRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Venta> listarPorEstado(int estado) {
        // Filtra la lista con stream y lambda
        return ventaRepository.findAll()
                .stream()
                .filter(v -> v.getEstado() == estado)
                .collect(Collectors.toList());
    }

    // Validaciones internas del servicio
    private void validarVenta(Venta venta) {
        if (venta.getCliente() == null) {
            throw new IllegalArgumentException("La venta debe tener un cliente asignado");
        }
        if (venta.getUsuario() == null) {
            throw new IllegalArgumentException("La venta debe tener un usuario asignado");
        }
        if (venta.getFechaVenta() == null) {
            throw new IllegalArgumentException("La fecha de venta es obligatoria");
        }
        if (venta.getTotal() == null || venta.getTotal().doubleValue() < 0) {
            throw new IllegalArgumentException("El total no puede ser negativo");
        }
    }
}