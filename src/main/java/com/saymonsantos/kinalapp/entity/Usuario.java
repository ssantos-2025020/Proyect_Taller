package com.saymonsantos.kinalapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codigo_usuario")
    private Integer codigoUsuario;

    @Column(name = "username", length = 45)
    private String username;

    @Column(name = "password", length = 45)
    private String password;

    @Column(name = "email", length = 60)
    private String email;

    // Rol del usuario ej. ADMIN, VENDEDOR
    @Column(name = "rol", length = 45)
    private String rol;

    // 1 = activo, 0 = inactivo
    @Column(name = "estado")
    private int estado;

    public Usuario() {}

    public Usuario(String username, String password, String email, String rol, int estado) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.rol = rol;
        this.estado = estado;
    }

    public Integer getCodigoUsuario() { return codigoUsuario; }
    public void setCodigoUsuario(Integer codigoUsuario) { this.codigoUsuario = codigoUsuario; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public int getEstado() { return estado; }
    public void setEstado(int estado) { this.estado = estado; }
}