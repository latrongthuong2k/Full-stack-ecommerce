package com.ecommerce.myapp.config;


import com.ecommerce.myapp.repositories.AppUserRepository;
import com.ecommerce.myapp.services.app.AppAuditAwareService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.time.Duration;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class AppConfiguration {

    private final AppUserRepository appUserRepository;

    // tự động lấy userName từ
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> appUserRepository.findByUserNameOrEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }


    //     tìm nạp từ interface user-detail và băm pass
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuditorAware<Long> auditorAware(AppUserRepository appUserRepository) {
        return new AppAuditAwareService(appUserRepository);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(List.of("https://web-admin-ecommerce-project.vercel.app"));
//        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedOriginPatterns(List.of("*")); // Cho phép domain của FE
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE")); // Thêm OPTIONS cho preflight
        configuration.setAllowedHeaders(List.of("Authorization", "Cache-Control", "Content-Type"));
        configuration.setExposedHeaders(List.of("*"));
        configuration.setAllowCredentials(true); // Cho phép gửi credentials như cookies, authorization headers
        configuration.setMaxAge(3600L); // Thời gian tồn tại của preflight response trong cache của trình duyệt (tính bằng giây)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Áp dụng cho tất cả các endpoint
        return source;
    }

    // Bucket4jConfiguration
    @Bean
    public Bucket bucket() {
        // Cấu hình băng thông: cho phép 10 yêu cầu mỗi phút
        Refill refill = Refill.greedy(100, Duration.ofMinutes(1)); // Nạp 100 tokens mỗi phút
        Bandwidth limit = Bandwidth.classic(100, refill); // Sức chứa tối đa là 100 tokens

        return Bucket.builder()
                .addLimit(limit)
                .build();
    }
}
