package com.saymonsantos.kinalapp.repository;

import com.saymonsantos.kinalapp.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente,String> {
}

