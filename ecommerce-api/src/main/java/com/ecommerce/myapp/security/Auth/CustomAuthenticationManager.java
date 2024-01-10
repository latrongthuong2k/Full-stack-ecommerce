package com.ecommerce.myapp.security.Auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class CustomAuthenticationManager implements UserAuthenticationManager {
    private final AuthenticationManager authenticationManager;

    public CustomAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public void authenticate(String email, String password) throws Exception {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }

    @Override
    public void authenticate(UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken) {
        authenticationManager.authenticate(usernamePasswordAuthenticationToken);
    }
}

