package com.saymonsantos.kinalapp.repository;

import com.saymonsantos.kinalapp.entity.DetalleVenta;
import org.springframework.data.jpa.repository.JpaRepository;

// JpaRepository nos da los métodos básicos sin escribir SQL
// Integer es el tipo de la llave primaria
public interface DetalleVentaRepository extends JpaRepository<DetalleVenta, Integer> {
}