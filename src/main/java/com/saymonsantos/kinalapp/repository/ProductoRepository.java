package com.saymonsantos.kinalapp.repository;

import com.saymonsantos.kinalapp.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

// JpaRepository nos da los métodos básicos sin escribir SQL
// Integer es el tipo de la llave primaria
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
}