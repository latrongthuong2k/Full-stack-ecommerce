package com.ecommerce.myapp.exceptions;

import java.time.LocalDateTime;
import java.util.Map;

public record ValidErrorRes(
        int status,
        Map<String, String> errors,
        String path,
        LocalDateTime timestamp) {
}
