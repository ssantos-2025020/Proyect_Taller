package com.saymonsantos.kinalapp.service;

import com.saymonsantos.kinalapp.entity.Cliente;

import java.util.List;
import java.util.Optional;

public interface IClienteService {
    //interfaz> Es un contrasto que dice que metodos debe tener
    //cualquier servicio de Clientes, No tiene
    //Implementacion, solo la definicion de los metodos

    //Metodo que devuelve una lista de todos los clientes
    List<Cliente> listarTodos();
    //List<Cliente> lo que hace es volver una lista
    //de objetos de la entidad Clientes

    //Metodo que guarda en Clientes en la BD
    Cliente guardar(Cliente cliente);
    //Parametros - Recibe un objeto cliente con los datos a guardar

    //Optional - contenedor que puede o no tener un valor
    //Evita el error de NullPointerException
    Optional<Cliente> buscarPorDPI(String dpi_Clientes);

    //Metodo que actualiza un cliente
    Cliente actualizar (String dpi, Cliente cliente);
    //Parametros - dpi: DPI del cliente a actualizar
    //Cliente cliente: Objeto con los datos nuevos
    // Retorna un objeto de tipo Clientes ya actualizado

    //Metodo de tipo void para eliminar a un cliente
    //void: no retorna nada
    //Elimina un Cliente por su DPI
    void eliminar (String dpi);

    //boolean - Retorna tru si existe, false si no existe
    boolean existePorDPI(String dpi);

    //Metodo para listar clientes por su estado (Activo/Inactivo) ---
    List<Cliente> listarPorEstado(int estado);
}