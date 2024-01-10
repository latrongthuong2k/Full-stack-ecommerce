package com.ecommerce.myapp.security.oauth2;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class RandomPasswordGenerator {

    private static final String CHAR_LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String CHAR_UPPER = CHAR_LOWER.toUpperCase();
    private static final String NUMBER = "0123456789";
    private static final String OTHER_CHAR = "!@#$%&*()_+-=[]?";
    private static final String PASSWORD_ALLOW_BASE = CHAR_LOWER + CHAR_UPPER + NUMBER + OTHER_CHAR;
    // Optional: remove confusing characters like 'l' and 'O'.
    private static final String PASSWORD_ALLOW = PASSWORD_ALLOW_BASE.replaceAll("[lIO0o]", "");

    private static final SecureRandom random = new SecureRandom();

    public String generateRandomPassword(int length) {
        if (length <= 0) {
            throw new IllegalArgumentException("Password length must be positive");
        }

        return IntStream.range(0, length)
                .map(i -> random.nextInt(PASSWORD_ALLOW.length()))
                .mapToObj(PASSWORD_ALLOW::charAt)
                .map(Object::toString)
                .collect(Collectors.joining());
    }
}
