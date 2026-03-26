package com.saymonsantos.kinalapp.service;

import com.saymonsantos.kinalapp.entity.Cliente;
import com.saymonsantos.kinalapp.repository.ClienteRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

//Anotacion que registra un Bean o modelo como Bean de Spring
//que la clase contienen la logica del negocio
//por edfoctoo todos los metodos ded esta clase seran
@Service
//transaccionales
//Una transcccion es que puede o no ocurrir algo
@Transactional
public class ClienteService implements IClienteService {
    /*private: solo accesible dentro de la clase
    ClienteRepository: Es el repositorio para acceder
    Inyecta de Dependencias Spring nos da el repositorio

     */
    private final ClienteRepository clienteRepository;
    /* Constructor: Este se ejecuta al crear el objeto
     * Parámetros: Spring pasa el repositorio automáticamente y a esto se le conoce
     * como Inyección de Dependencias
     * Asignamos el repositorio a nuestra variable de clase
     */
    // Constructor para que Spring inyecte el repositorio automáticamente
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    /*
     * @Override: Indicar que estamos implementando un metodo de la interfaz
     * */
    @Override

    /*
     * readOnly = true: Lo que hace es optimizar la consulta, no bloquea la BD
     * */
    @Transactional(readOnly = true)
    public List<Cliente> listarTodos() {
        // Retorna todos los registros de la tabla clientes
        return clienteRepository.findAll();
        /*
         * Llama al método findAll() del repositorio de Spring Data JPA
         * este metodo hace exactamente el Select * from Clientes
         * */
    }

    @Override
    public Cliente guardar(Cliente cliente) {
        /*
         * Metodo de guardar crea un Cliente
         * Acá es donde colocamos la l+ogica del negocio Antes de guardar
         * Primero validamos el dato
         * */
        validarCliente(cliente);
        if (cliente.getEstado()==0){
            cliente.setEstado(1);
        }
        return clienteRepository.save(cliente);
    }


    @Override
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorDPI(String dpi) {
        // Busca en la base de datos usando el ID (DPI)
        return clienteRepository.findById(dpi);
        //Optional me evita el NullPointerException
    }

    @Override
    public Cliente actualizar(String dpi, Cliente cliente) {
        //Actualiza un cliente existente
        if(!clienteRepository.existsById(dpi)){
            throw new RuntimeException("Cliente no se encontró con DPI " + dpi);
            //Si no existe, se lanza una excepción (error controlado)
        }
        /*
         * 1. Asegurar que el DPI del objeto coincida con el de la URL
         * 2. por seguridad usamos el DPI de la URL y no el que viene en el JSON
         * */
        cliente.setDPICliente(dpi);
        validarCliente(cliente);

        return clienteRepository.save(cliente);
    }

    @Override
    public void eliminar(String dpi) {
        //Eliminar un cliente
        if(!clienteRepository.existsById(dpi)){
            throw new RuntimeException("Cliente no se encontró con DPI " + dpi);
            //Si no existe, se lanza una excepción (error controlado)
        }
        // Elimina el registro por su llave primaria
        clienteRepository.deleteById(dpi);
        /*
         * Llama al método deleteById() del repositorio
         * este metodo hace exactamente el Delete from Clientes where dpi = ?
         * */
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existePorDPI(String dpi) {
        //Verificar si existe el cliente
        return clienteRepository.existsById(dpi);
        /*
         * Verifica si el registro existe en la BD
         * retorna true o false
         * */
    }

    @Override
    @Transactional(readOnly = true)
    public List<Cliente> listarPorEstado(int estado) {
        // Trae todos los clientes y filtra con Stream + Lambda
        return clienteRepository.findAll()
                .stream()
                // Lambda: filtra solo los que tienen el estado indicado
                .filter(cliente -> cliente.getEstado() == estado)
                .collect(Collectors.toList());
        //Esto lo saque de https://stackoverflow.com/questions/30012295/java-8-lambda-filter-by-lists
    }

    //Metodo privado(solo puede utilizarse dentro de la clase)
    private void validarCliente(Cliente cliente){
        /*
         * Validaciones del negocio: Este metodo se hará privado porque
         * es algo interno del servicio
         * */
        if (cliente.getDPICliente() == null || cliente.getDPICliente().trim().isEmpty()){
            //Lanza una excepcion con un mensaje
            throw new IllegalArgumentException("El DPI es un dato obligatorio");
        }

        if (cliente.getNombreCliente() == null || cliente.getNombreCliente().trim().isEmpty()){
            throw new IllegalArgumentException("El nombre es un dato obligatorio");
        }

        if (cliente.getApellidoCliente() == null || cliente.getApellidoCliente().trim().isEmpty()){
            throw new IllegalArgumentException("El apellido es un dato obligatorio");
        }
    }
}