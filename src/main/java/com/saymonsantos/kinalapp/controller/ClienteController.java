package com.saymonsantos.kinalapp.controller;

import com.saymonsantos.kinalapp.entity.Cliente;
import com.saymonsantos.kinalapp.service.ClienteService;
import com.saymonsantos.kinalapp.service.IClienteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
//@RestController = @Controller + @ResponseBody
@RequestMapping("/clientes")
// Todas las rutas en este controlador deben empezar con /clientes
public class ClienteController {

    // Inyectamos el SERVICIO y NO el repositorio
    // El controlador solo debe de tener conexión con el Servicio
    private final IClienteService clienteService;

    // Como buena práctica la Inyección de dependencias deber hacerse por el constructor
    public ClienteController(IClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // Responde a peticiones GET
    @GetMapping
    // ResponseEntity nos permite controlar el codigo HTTP y el cuerpo
    public ResponseEntity<List<Cliente>> listar() {
        List<Cliente> clientes = clienteService.listarTodos();
        // delegamos al servicio
        return ResponseEntity.ok(clientes);
        // 200 OK con la lista de clientes
    }

    // {dpi} es una variable de ruta (valor a buscar)
    @GetMapping("/{dpi}")
    public ResponseEntity<Cliente> buscarPorDPI(@PathVariable String dpi) {
        // @PathVariable Toma el valor de la URL y lo asigna al dpi
        return clienteService.buscarPorDPI(dpi)
                // Si Optional tiene valor, devuelve 200 ok con el cliente
                .map(ResponseEntity::ok)
                // Si Optional está vacio, devuelve 404 NOT FOUND
                .orElse(ResponseEntity.notFound().build());
    }

    // POST crear un nuevo cliente
    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Cliente cliente) {
        // @RequestBody: Toma el JSON del cuerpo y lo convierte a un objeto de tipo Cliente
        // <?> significa "tipo genérico" puede ser un Cliente o un String
        try {
            // Intentamos guardar el cliente pero puede lanzar una excepcion de IllegalArgumentException
            Cliente nuevoCliente = clienteService.guardar(cliente);
            return new ResponseEntity<>(nuevoCliente, HttpStatus.CREATED);
            // 201 CREATED (mucho más específico que el 200 para la creación de un cliente)
        } catch (IllegalArgumentException e) {
            // Si hay error de validacion
            return ResponseEntity.badRequest().body(e.getMessage());
            // 400 BAD REQUEST con el mensaje de error
        }
    }

    // DELETE elimina un cliente
    @DeleteMapping("/{dpi}")
    public ResponseEntity<Void> eliminar(@PathVariable String dpi) {
        // ResponseEntity<Void>: No devuelve cuerpo en la respuesta
        try {
            if (!clienteService.existePorDPI(dpi)) {
                return ResponseEntity.notFound().build();
                // 404 si no existe
            }
            clienteService.eliminar(dpi);
            return ResponseEntity.noContent().build();
            // 204 NO CONTENT (se ejecutó correctamente y no devuelve cuerpo)
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
            // 404 NOT FOUND
        }

    }
    // PUT actualizar un cliente existente
    // Actualizar cliente a través de DPI
    @PutMapping("/{dpi}")
    public ResponseEntity<?> actualizar(@PathVariable String dpi, @RequestBody Cliente cliente) {
        // @PathVariable toma el dpi de la URL y @RequestBody toma los nuevos datos del JSON
        try {
            // Verificar si existe antes de poder actualizar
            if (!clienteService.existePorDPI(dpi)) {
                // 404 NOT FOUND si el cliente no existe
                return ResponseEntity.notFound().build();
            }

            // Actualizar el cliente pero esto puede lanzar una excepcion
            Cliente clienteActualizado = clienteService.actualizar(dpi, cliente);
            return ResponseEntity.ok(clienteActualizado);
            // 200 OK con el cliente ya actualizado

        } catch (IllegalArgumentException e) {
            // Error cuando los datos son incorrectos (ej. validaciones fallidas)
            return ResponseEntity.badRequest().body(e.getMessage());
            // 400 BAD REQUEST con el mensaje de error

        } catch (RuntimeException e) {
            // Posiblemente cualquier otro error como: cliente no encontrado, etc.
            return ResponseEntity.notFound().build();
            // 404 NOT FOUND
        }
    }

    /// GET listar solo clientes activos
    @GetMapping("/activos")
    public ResponseEntity<List<Cliente>> listarActivos() {
        // CAMBIO: Usamos 'clienteService' (la variable inyectada), no la Clase.
        List<Cliente> activos = clienteService.listarPorEstado(1);

        // Si la lista está vacía, podemos devolver 204 o simplemente la lista vacía con 200
        return ResponseEntity.ok(activos);
        // 200 OK con la lista de clientes que tienen estado activo
    }
    // Esto lo saque de aqui https://stackoverflow.com/questions/65171828/how-to-return-an-array-of-objects-in-json-format-in-spring-boot

}