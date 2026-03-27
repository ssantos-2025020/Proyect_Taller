package com.saymonsantos.kinalapp.service;

import com.saymonsantos.kinalapp.entity.DetalleVenta;
import com.saymonsantos.kinalapp.repository.DetalleVentaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class DetalleVentaService implements IDetalleVentaService {

    private final DetalleVentaRepository detalleVentaRepository;

    // Spring inyecta el repositorio automáticamente
    public DetalleVentaService(DetalleVentaRepository detalleVentaRepository) {
        this.detalleVentaRepository = detalleVentaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DetalleVenta> listarTodos() {
        // SELECT * FROM DetalleVenta
        return detalleVentaRepository.findAll();
    }

    @Override
    public DetalleVenta guardar(DetalleVenta detalleVenta) {
        validarDetalleVenta(detalleVenta);
        // El subtotal se calcula automático: cantidad * precioUnitario
        BigDecimal subtotal = detalleVenta.getPrecioUnitario()
                .multiply(new BigDecimal(detalleVenta.getCantidad()));
        detalleVenta.setSubtotal(subtotal);
        return detalleVentaRepository.save(detalleVenta);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DetalleVenta> buscarPorId(Integer id) {
        return detalleVentaRepository.findById(id);
    }

    @Override
    public DetalleVenta actualizar(Integer id, DetalleVenta detalleVenta) {
        if (!detalleVentaRepository.existsById(id)) {
            throw new RuntimeException("Detalle no encontrado con ID: " + id);
        }
        detalleVenta.setCodigoDetalleVenta(id);
        validarDetalleVenta(detalleVenta);
        // Recalculamos el subtotal al actualizar
        BigDecimal subtotal = detalleVenta.getPrecioUnitario()
                .multiply(new BigDecimal(detalleVenta.getCantidad()));
        detalleVenta.setSubtotal(subtotal);
        return detalleVentaRepository.save(detalleVenta);
    }

    @Override
    public void eliminar(Integer id) {
        if (!detalleVentaRepository.existsById(id)) {
            throw new RuntimeException("Detalle no encontrado con ID: " + id);
        }
        // DELETE FROM DetalleVenta WHERE codigo_detalle_venta = ?
        detalleVentaRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePorId(Integer id) {
        return detalleVentaRepository.existsById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DetalleVenta> listarPorVenta(Integer ventaId) {
        // Filtra los detalles que pertenecen a una venta específica
        return detalleVentaRepository.findAll()
                .stream()
                .filter(d -> d.getVenta().getCodigoVenta().equals(ventaId))
                .collect(Collectors.toList());
    }

    // Validaciones internas del servicio
    private void validarDetalleVenta(DetalleVenta detalleVenta) {
        if (detalleVenta.getProducto() == null) {
            throw new IllegalArgumentException("El detalle debe tener un producto asignado");
        }
        if (detalleVenta.getVenta() == null) {
            throw new IllegalArgumentException("El detalle debe tener una venta asignada");
        }
        if (detalleVenta.getCantidad() == null || detalleVenta.getCantidad() <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a cero");
        }
        if (detalleVenta.getPrecioUnitario() == null || detalleVenta.getPrecioUnitario().doubleValue() <= 0) {
            throw new IllegalArgumentException("El precio unitario debe ser mayor a cero");
        }
    }
}