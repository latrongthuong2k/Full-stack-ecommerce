package com.ecommerce.myapp.security.oauth2;

import com.ecommerce.myapp.model.user.AppUser;
import com.ecommerce.myapp.model.user.Role;
import com.ecommerce.myapp.repositories.AppUserRepository;
import com.ecommerce.myapp.security.ReqResSecurity.AuthenticationResponse;
import com.ecommerce.myapp.security.Token.Token;
import com.ecommerce.myapp.security.Token.TokenRepository;
import com.ecommerce.myapp.security.Token.TokenType;
import com.ecommerce.myapp.security.config.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
@AllArgsConstructor
public class Auth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final RandomPasswordGenerator randomPasswordGenerator;
    private final JwtService jwtService;
    private final TokenRepository tokenRepository;

    public AuthenticationResponse register(AppUser user) {
        var jwtToken = jwtService.generateToken(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AppUser user) {
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, refreshToken);
        return AuthenticationResponse.builder()
                .accessToken(refreshToken)
                .build();
    }
    public void saveUserToken(AppUser user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    public void revokeAllUserTokens(AppUser user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getUserId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String givenName = (String) attributes.get("given_name");
        String name = (String) attributes.get("name");
        // Check if the user exists, and if not create a new one
        AppUser user;
        AuthenticationResponse authRes;
        // Check if the user exists, and if not create a new one
        Optional<AppUser> existingUser = appUserRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            user = existingUser.get();
            authRes = authenticate(user);
        } else {
            // User doesn't exist, create a new one
            user = new AppUser();
            // Set fields from attributes
            user.setUserName(email);
            user.setFullName(STR."\{givenName} \{name}");
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(randomPasswordGenerator.generateRandomPassword(10)));
            user.setRole(Role.USER);
            appUserRepository.save(user);
            authRes = register(user);
        }

        // Set content type to JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        Cookie tokenCookie = new Cookie("auth-token", authRes.getAccessToken());
        tokenCookie.setHttpOnly(true);
        tokenCookie.setSecure(true);
        tokenCookie.setPath("/");
        tokenCookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(tokenCookie);
        // Redirect without token in the URL
        response.sendRedirect("http://localhost:3000");

        // Send token as a JSON response
//         getRedirectStrategy().sendRedirect(request, response,
//                "http://localhost:3000/api?token=" +
//                URLEncoder.encode(authRes.getAccessToken() , StandardCharsets.UTF_8));
    }
}