package com.saymonsantos.kinalapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UsuarioDetailsService usuarioDetailsService;

    public SecurityConfig(UsuarioDetailsService usuarioDetailsService) {
        this.usuarioDetailsService = usuarioDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth

                        // ── Recursos estáticos — siempre públicos ──
                        .requestMatchers(
                                "/css/**", "/js/**", "/images/**",
                                "/webjars/**", "/**/*.css", "/**/*.js",
                                "/**/*.png", "/**/*.ico"
                        ).permitAll()

                        // ── Páginas públicas ──
                        .requestMatchers(
                                "/login.html",
                                "/registro.html",
                                "/registro"
                        ).permitAll()

                        // ── CLIENTES ──
                        .requestMatchers(HttpMethod.GET,    "/clientes/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.POST,   "/clientes/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.PUT,    "/clientes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/clientes/**").hasRole("ADMIN")

                        // ── PRODUCTOS ──
                        .requestMatchers(HttpMethod.GET,    "/productos/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.POST,   "/productos/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.PUT,    "/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/productos/**").hasRole("ADMIN")

                        // ── VENTAS ──
                        .requestMatchers(HttpMethod.GET,    "/ventas/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.POST,   "/ventas/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.PUT,    "/ventas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/ventas/**").hasRole("ADMIN")

                        // ── DETALLE VENTA ──
                        .requestMatchers(HttpMethod.GET,    "/detalle-ventas/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.POST,   "/detalle-ventas/**").hasAnyRole("ADMIN", "USER")
                        .requestMatchers(HttpMethod.PUT,    "/detalle-ventas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/detalle-ventas/**").hasRole("ADMIN")

                        // ── USUARIOS ──
                        .requestMatchers(HttpMethod.GET, "/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/usuarios/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/usuarios/**").hasRole("ADMIN")

                        // ── INDEX / DASHBOARD ──
                        .requestMatchers("/index.html").hasAnyRole("ADMIN", "USER")

                        // ── API ENDPOINTS ──
                        .requestMatchers("/api/usuario-actual", "/login-success").authenticated()

                        // ── Todo lo demás requiere autenticación ──
                        .anyRequest().authenticated()
                )

                // ── FORMULARIO DE LOGIN ──
                .formLogin(form -> form
                        .loginPage("/login.html")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/index.html", true)
                        .failureUrl("/login.html?error=true")
                        .permitAll()
                )

                // ── LOGOUT ──
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login.html?logout=true")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .permitAll()
                )

                // ── CSRF — deshabilitado para API REST ──
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers(
                                "/clientes/**", "/productos/**",
                                "/ventas/**", "/detalle-ventas/**",
                                "/usuarios/**", "/registro"
                        )
                );

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(usuarioDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    @SuppressWarnings("deprecation")
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}