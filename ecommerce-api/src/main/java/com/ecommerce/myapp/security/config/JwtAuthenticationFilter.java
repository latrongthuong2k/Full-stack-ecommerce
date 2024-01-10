package com.ecommerce.myapp.security.config;

import com.ecommerce.myapp.security.Token.TokenRepository;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;
    private final Bucket bucket;
    private static final int TOO_MANY_REQUESTS = 429;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Rate limiting logic
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            response.setContentType("text/plain");
            response.setCharacterEncoding("UTF-8");
            response.setStatus(TOO_MANY_REQUESTS);
            double waitForRefill = probe.getNanosToWaitForRefill() / 1_000_000_000.0;
            try (PrintWriter out = response.getWriter()) {
                out.print("Too many requests - please wait " + waitForRefill + " seconds");
                out.flush();
            }
            return; // Quan trọng: Dừng xử lý nếu rate limit được áp dụng
        }

        // Authentication path bypass logic
        if (request.getServletPath().contains("/api/v1/auth") || request.getServletPath().contains("/api/v1/client")) {
            filterChain.doFilter(request, response);
            return;
            // Quan trọng: Dừng xử lý nếu đang xử lý đường dẫn xác thực
        }

        // Cookie authentication logic
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("auth-token".equals(cookie.getName())) {
                    String token = cookie.getValue();
                    try {
                        authenticateToken(request, token);
                    } catch (JwtException e) {
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        System.out.println(e.getMessage());
                        return;
                    }
                }
                break;
                // Phát hiện cookie và xử lý xác thực, không cần kiểm tra thêm
            }
        }

        // Header authentication logic
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            try {
                authenticateToken(request, jwt);
            } catch (JwtException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                System.out.println(e.getMessage());
                return;
            }
        }
        filterChain.doFilter(request, response);
        // Quan trọng: Gọi này nên ở cuối và chỉ gọi một lần
    }

    private void authenticateToken(HttpServletRequest request, String token) {
        String userEmail = jwtService.extractUsername(token);
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            var isTokenValid = tokenRepository.findByToken(token)
                    .map(t -> !t.isExpired() && !t.isRevoked())
                    .orElse(false);
            if (jwtService.isTokenValid(token, userDetails) && isTokenValid) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
    }
}