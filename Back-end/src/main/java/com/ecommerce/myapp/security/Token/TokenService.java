package com.ecommerce.myapp.security.Token;

import com.ecommerce.myapp.model.user.AppUser;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
    private final TokenRepository tokenRepository;

    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public void deleteAllExpiredTokenWhenReachedLimit(int limit) {

        int totalTokens = tokenRepository.findAllInValidToken();
        if (totalTokens > limit) {
            tokenRepository.deleteExpiredTokens();
        }

    }

    public Token findByUser(AppUser appUser) {
        return tokenRepository.findByUser(appUser);
    }
}
