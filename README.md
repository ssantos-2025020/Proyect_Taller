# KinalApp

Sistema de ventas desarrollado con Spring Boot y MySQL. Permite gestionar clientes, usuarios, productos, ventas y detalle de ventas a través de una API REST.

---

##  Tecnologías utilizadas

- **Java 21**
- **Spring Boot 4.0.2**
- **Spring Data JPA / Hibernate**
- **MySQL 8.0**
- **Maven**
- **IntelliJ IDEA**

---

##  Configuración del proyecto

### Requisitos previos

- Java 21 instalado
- MySQL 8.0 instalado
- IntelliJ IDEA instalado
- Maven instalado

### Clonar el repositorio

```bash
git clone https://github.com/saymonsantos/kinalapp.git
cd kinalapp
```


CREATE DATABASE kinal_db;
```

Configurar el archivo `src/main/resources/application.properties`:

spring.application.name=kinalapp

#Conexion a MySql
spring.datasource.url=jdbc:mysql://localhost:3306/kinal_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=IN5AM
spring.datasource.password=TU_PASSWORD_AQUI
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

#JPA/ Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

server.port=9000

```

### Correr el proyecto

```bash
mvn spring-boot:run
```

---

##  Estructura del proyecto

```
src/main/java/com/saymonsantos/kinalapp/
├── entity/
│   ├── Cliente.java
│   ├── Usuario.java
│   ├── Producto.java
│   ├── Venta.java
│   └── DetalleVenta.java
├── repository/
│   ├── ClienteRepository.java
│   ├── UsuarioRepository.java
│   ├── ProductoRepository.java
│   ├── VentaRepository.java
│   └── DetalleVentaRepository.java
├── service/
│   ├── IClienteService.java / ClienteService.java
│   ├── IUsuarioService.java / UsuarioService.java
│   ├── IProductoService.java / ProductoService.java
│   ├── IVentaService.java / VentaService.java
│   └── IDetalleVentaService.java / DetalleVentaService.java
├── controller/
│   ├── ClienteController.java
│   ├── UsuarioController.java
│   ├── ProductoController.java
│   ├── VentaController.java
│   └── DetalleVentaController.java
└── KinalappApplication.java
```

---

##  Endpoints de la API

La API corre en `http://localhost:9000`

###  Clientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/clientes` | Lista todos los clientes |
| GET | `/clientes/{dpi}` | Busca un cliente por DPI |
| GET | `/clientes/activos` | Lista clientes activos |
| POST | `/clientes` | Crea un nuevo cliente |
| PUT | `/clientes/{dpi}` | Actualiza un cliente |
| DELETE | `/clientes/{dpi}` | Elimina un cliente |

**Body POST/PUT:**
```json
{
  "DPICliente": "1457689324567",
  "nombreCliente": "Juan",
  "apellidoCliente": "Perez",
  "direccion": "Zona 1 Guatemala",
  "estado": 1
}
```

---

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/usuarios` | Lista todos los usuarios |
| GET | `/usuarios/{id}` | Busca un usuario por ID |
| GET | `/usuarios/activos` | Lista usuarios activos |
| GET | `/usuarios/rol/{rol}` | Lista usuarios por rol |
| POST | `/usuarios` | Crea un nuevo usuario |
| PUT | `/usuarios/{id}` | Actualiza un usuario |
| DELETE | `/usuarios/{id}` | Elimina un usuario |

**Body POST/PUT:**
```json
{
  "username": "jsantos",
  "password": "123456",
  "email": "jsantos@kinal.edu.gt",
  "rol": "VENDEDOR",
  "estado": 1
}
```

---

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/productos` | Lista todos los productos |
| GET | `/productos/{id}` | Busca un producto por ID |
| GET | `/productos/activos` | Lista productos activos |
| POST | `/productos` | Crea un nuevo producto |
| PUT | `/productos/{id}` | Actualiza un producto |
| DELETE | `/productos/{id}` | Elimina un producto |

**Body POST/PUT:**
```json
{
  "nombreProducto": "Laptop HP",
  "precio": 3500.00,
  "stock": 10,
  "estado": 1
}
```

---

### Ventas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/ventas` | Lista todas las ventas |
| GET | `/ventas/{id}` | Busca una venta por ID |
| GET | `/ventas/activas` | Lista ventas activas |
| POST | `/ventas` | Crea una nueva venta |
| PUT | `/ventas/{id}` | Actualiza una venta |
| DELETE | `/ventas/{id}` | Elimina una venta |

**Body POST/PUT:**
```json
{
  "fechaVenta": "2025-03-26",
  "total": 3500.00,
  "estado": 1,
  "cliente": {
    "DPICliente": "1457689324567",
    "nombreCliente": "Juan",
    "apellidoCliente": "Perez",
    "direccion": "Zona 1 Guatemala",
    "estado": 1
  },
  "usuario": {
    "codigoUsuario": 1,
    "username": "jsantos",
    "password": "123456",
    "email": "jsantos@kinal.edu.gt",
    "rol": "VENDEDOR",
    "estado": 1
  }
}
```

---

# Detalle Venta

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/detalle-ventas` | Lista todos los detalles |
| GET | `/detalle-ventas/{id}` | Busca un detalle por ID |
| GET | `/detalle-ventas/venta/{id}` | Lista detalles por venta |
| POST | `/detalle-ventas` | Crea un nuevo detalle |
| PUT | `/detalle-ventas/{id}` | Actualiza un detalle |
| DELETE | `/detalle-ventas/{id}` | Elimina un detalle |

**Body POST/PUT:**
```json
{
  "cantidad": 2,
  "precioUnitario": 3500.00,
  "producto": {
    "codigoProducto": 1,
    "nombreProducto": "Laptop HP",
    "precio": 3500.00,
    "stock": 10,
    "estado": 1
  },
  "venta": {
    "codigoVenta": 1,
    "fechaVenta": "2025-03-26",
    "total": 3500.00,
    "estado": 1,
    "cliente": {
      "DPICliente": "1457689324567",
      "nombreCliente": "Juan",
      "apellidoCliente": "Perez",
      "direccion": "Zona 1 Guatemala",
      "estado": 1
    },
    "usuario": {
      "codigoUsuario": 1,
      "username": "jsantos",
      "password": "123456",
      "email": "jsantos@kinal.edu.gt",
      "rol": "VENDEDOR",
      "estado": 1
    }
  }
}
```

>  El subtotal se calcula automaticamente: `cantidad * precioUnitario`

---

##  Codigos HTTP

| Codigo | Significado |
|--------|-------------|
| 200 | Todo salio bien y devuelve datos |
| 201 | Se creo algo nuevo correctamente |
| 204 | Se elimino correctamente |
| 400 | Los datos que mandaste estan mal |
| 404 | Lo que buscas no existe |

---

##  Orden para probar en Postman

```
1. Crear Cliente    → POST /clientes
2. Crear Usuario    → POST /usuarios
3. Crear Producto   → POST /productos
4. Crear Venta      → POST /ventas
5. Crear Detalle    → POST /detalle-ventas
```

>  Siempre en ese orden porque cada uno depende del anterior

---

##  Solución de problemas

**Error: Cannot map null into type int**
Cambiar los campos `int` primitivos a `Integer` en las entidades.

**Error: 400 Bad Request en Venta**
Asegurarse de mandar el objeto `cliente` y `usuario` completos en el body, no solo el ID.

**Error: Puerto ya en uso**
Cambiar el puerto en `application.properties`:
```properties
server.port=9001
```

---

##  Prueba de Codigo

Al ejecutar el proyecto en IntelliJ se puede verificar que la aplicacion
inicia correctamente en el puerto 9000, que Spring detecta los 5 repositorios,
que Hibernate crea las tablas en la base de datos y que Tomcat queda listo
para recibir peticiones.

![Ejecucion del proyecto](screenshots/Codigo/ejecucion.png)

---

##  Pruebas en Postman

###  Cliente

Trae todos los clientes de la base de datos
![List Clientes](screenshots/Cliente/list-clientes.png)

Crea un nuevo cliente
![Add Clientes](screenshots/Cliente/add-clientes.png)

Busca un cliente por su DPI
![Find Clientes](screenshots/Cliente/find-clientes.png)

Actualiza los datos de un cliente existente
![Update Clientes](screenshots/Cliente/update-clientes.png)

Elimina un cliente por su DPI
![Delete Clientes](screenshots/Cliente/delete-clientes.png)

Trae solo los clientes con estado activo
![Activos Clientes](screenshots/Cliente/activos-clientes.png)

###  Usuario

Trae todos los usuarios de la base de datos
![List Usuarios](screenshots/Usuario/list-usuarios.png)

Crea un nuevo usuario
![Add Usuarios](screenshots/Usuario/add-usuarios.png)

Busca un usuario por su ID
![Find Usuarios](screenshots/Usuario/find-usuarios.png)

Actualiza los datos de un usuario existente
![Update Usuarios](screenshots/Usuario/update-usuarios.png)

Elimina un usuario por su ID
![Delete Usuarios](screenshots/Usuario/delete-usuarios.png)

Trae solo los usuarios con estado activo
![Activos Usuarios](screenshots/Usuario/activos-usuarios.png)

Trae usuarios filtrados por su rol
![Rol Usuarios](screenshots/Usuario/rol-usuarios.png)

###  Producto

Trae todos los productos de la base de datos
![List Productos](screenshots/Producto/list-productos.png)

Crea un nuevo producto
![Add Productos](screenshots/Producto/add-productos.png)

Busca un producto por su ID
![Find Productos](screenshots/Producto/find-productos.png)

Actualiza los datos de un producto existente
![Update Productos](screenshots/Producto/update-productos.png)

Elimina un producto por su ID
![Delete Productos](screenshots/Producto/delete-productos.png)

Trae solo los productos con estado activo
![Activos Productos](screenshots/Producto/activos-productos.png)

###  Venta

Trae todas las ventas de la base de datos
![List Ventas](screenshots/Venta/list-ventas.png)

Crea una nueva venta asociada a un cliente y usuario existente
![Add Ventas](screenshots/Venta/add-ventas.png)

Busca una venta por su ID
![Find Ventas](screenshots/Venta/find-ventas.png)

Actualiza los datos de una venta existente
![Update Ventas](screenshots/Venta/update-ventas.png)

Elimina una venta por su ID
![Delete Ventas](screenshots/Venta/delete-ventas.png)

Trae solo las ventas con estado activo
![Activas Ventas](screenshots/Venta/activas-ventas.png)

###  DetalleVenta

Trae todos los detalles de venta de la base de datos
![List DetalleVenta](screenshots/DetalleVenta/list-detalle-ventas.png)

Crea un nuevo detalle, el subtotal se calcula automaticamente
![Add DetalleVenta](screenshots/DetalleVenta/add-detalle-ventas.png)

Busca un detalle por su ID
![Find DetalleVenta](screenshots/DetalleVenta/find-detalle-ventas.png)

Actualiza los datos de un detalle existente
![Update DetalleVenta](screenshots/DetalleVenta/update-detalle-ventas.png)

Elimina un detalle por su ID
![Delete DetalleVenta](screenshots/DetalleVenta/delete-detalle-ventas.png)

Trae todos los detalles que pertenecen a una venta especifica
![PorVenta DetalleVenta](screenshots/DetalleVenta/porventa-detalle-ventas.png)

---

##  Autor

**Saymon Santos - 2025020**
Proyecto KinalApp - 2026
