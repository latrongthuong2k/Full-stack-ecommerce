package com.ecommerce.myapp.config;

import com.ecommerce.myapp.model.user.Permission;
import com.ecommerce.myapp.security.Token.TokenService;
import com.ecommerce.myapp.security.config.JwtAuthenticationFilter;
import com.ecommerce.myapp.security.oauth2.Auth2SuccessHandler;
import com.ecommerce.myapp.security.oauth2.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import static com.ecommerce.myapp.model.user.Role.ADMIN;
import static com.ecommerce.myapp.model.user.Role.MANAGER;
import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {
    private final LogoutHandler logoutHandler;
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final Auth2SuccessHandler Auth2SuccessHandler;
    private final TokenService tokenService;


    private static final String[] WHITE_LIST_URL = {
            "/api/v1/auth/**",
            "/api/v1/client/**"
    };

    @Value("${FE_BASE_URL}")
    private String feBaseUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(req ->
                        req
                                .requestMatchers(WHITE_LIST_URL).permitAll()
                                .requestMatchers("/api/v1/management/**").hasAnyRole(ADMIN.name(), MANAGER.name())
                                .requestMatchers(GET, "/api/v1/management/**").hasAnyAuthority(
                                        Permission.ADMIN_READ.name(), Permission.MANAGER_READ.name())
                                .requestMatchers(POST, "/api/v1/management/**").hasAnyAuthority(
                                        Permission.ADMIN_CREATE.name(), Permission.MANAGER_CREATE.name())
                                .requestMatchers(PUT, "/api/v1/management/**").hasAnyAuthority(
                                        Permission.ADMIN_UPDATE.name(), Permission.MANAGER_UPDATE.name())
                                .requestMatchers(DELETE, "/api/v1/management/**").hasAnyAuthority(
                                        Permission.ADMIN_DELETE.name(), Permission.MANAGER_DELETE.name())
                                .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .cors(Customizer.withDefaults())
//                .formLogin(loginConfig -> {
//                    loginConfig.loginPage("http://localhost:3000/auth/login")
//                            .loginProcessingUrl("/api/v1/auth/sign-in")
//                            .successHandler((request, response, authentication) -> {
//                                AppUser appUser = (AppUser) authentication.getPrincipal();
//                                Token token = tokenService.findByUser(appUser);
//                                Cookie tokenCookie = new Cookie("auth-token", token.getToken());
//                                tokenCookie.setHttpOnly(true);
//                                tokenCookie.setSecure(true);
//                                tokenCookie.setPath("/");
//                                tokenCookie.setMaxAge(7 * 24 * 60 * 60);
//                                response.addCookie(tokenCookie);
//                                response.sendRedirect("http://localhost:3000");
//                                response.setStatus(HttpServletResponse.SC_OK);
//                            })
//                            .failureHandler((request, response, exception) -> {
//                                System.out.println(STR."Đăng nhập thất bại: \{exception.getMessage()}");
//                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                            });
//                })
                .oauth2Login(oauth2Login ->
                        oauth2Login
                                .userInfoEndpoint(userInfo ->
                                        userInfo.userService(customOAuth2UserService)
                                ).successHandler(Auth2SuccessHandler)
                )
                .logout(logout ->
                        logout.logoutUrl("/api/v1/auth/logout")
                                .addLogoutHandler(logoutHandler)
                                .logoutSuccessHandler((request, response, authentication) -> {
                                    SecurityContextHolder.clearContext();
                                    response.sendRedirect("http://localhost:3000/jp/client/men");
                                })
                );
        return http.build();
    }
}