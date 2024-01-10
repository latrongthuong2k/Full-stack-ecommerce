package com.ecommerce.myapp.security.Auth;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

public interface UserAuthenticationManager {
    void authenticate(String email, String password) throws Exception;

    void authenticate(UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken);
}
