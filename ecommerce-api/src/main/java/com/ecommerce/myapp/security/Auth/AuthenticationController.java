package com.ecommerce.myapp.security.Auth;

import com.ecommerce.myapp.dtos.user.response.AuthDto;
import com.ecommerce.myapp.exceptions.DuplicateResourceException;
import com.ecommerce.myapp.security.ReqResSecurity.AuthenticationRequest;
import com.ecommerce.myapp.security.ReqResSecurity.AuthenticationResponse;
import com.ecommerce.myapp.security.ReqResSecurity.RegisterRequest;
import com.ecommerce.myapp.security.Token.TokenRepository;
import com.ecommerce.myapp.security.config.JwtService;
import com.ecommerce.myapp.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;

@Controller
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authService;
    private final UserService userService;
    private final TokenRepository tokenRepository;
    private final JwtService jwtService;

    @PostMapping("/sign-up")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody
                                                           RegisterRequest request,
                                                           HttpServletResponse httpServletResponse) throws IOException {

        if (userService.existsByEmail("", request.getUserName().toLowerCase())) {
            throw new DuplicateResourceException("UserName  has already been taken");
        } else if (userService.existsByEmail(request.getEmail().toLowerCase(), "")) {
            throw new DuplicateResourceException("Email name has already been taken");
        }
        AuthenticationResponse res = authService.register(request);
        Cookie cookie = new Cookie("auth-token", res.getAccessToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        httpServletResponse.addCookie(cookie);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticationRequest request,
                                                               HttpServletResponse httpServletResponse) {
        AuthenticationResponse res = authService.authenticate(request);

        if (res == null) {
            httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).build();
        }
        Cookie cookie = new Cookie("auth-token", res.getAccessToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        httpServletResponse.addCookie(cookie);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authService.refreshToken(request, response);
    }


    @GetMapping("/check-authentication")
    public ResponseEntity<AuthDto> checkAuthentication(HttpServletRequest request) {

        String token = getCookieByName(request, "auth-token");
        if (token == null)
            throw new BadCredentialsException("token is null");
        String userName = jwtService.extractUsername(token);
        if (userName == null) {
            tokenRepository.findByToken(token).ifPresent(tokenRepository::delete);
            throw new BadCredentialsException("Invalid token");
        }
//        var check = tokenRepository.findByToken(token);
//        System.out.println("check" + check);
        if (tokenRepository.findByToken(token).isPresent()) {
            var appUser = userService.findByUserName(userName);
            AuthDto resAuh = new AuthDto(appUser.getUserId(),appUser.getRole());
            return ResponseEntity.ok(resAuh);
        } else {
            throw new BadCredentialsException("Invalid token");
        }
    }


    public static String getCookieByName(HttpServletRequest request, String nameCookie) {
        Cookie[] cookies = request.getCookies();
        String token = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (nameCookie.equals(cookie.getName())) {
                    token = cookie.getValue();
                    break;
                }
            }
        }
        return token;
    }
}