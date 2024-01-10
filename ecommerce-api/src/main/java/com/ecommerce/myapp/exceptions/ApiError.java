package com.ecommerce.myapp.exceptions;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;

public record ApiError(
        @JsonProperty("error-status")
        int status,
        @JsonProperty("message")
        String message,
        @JsonProperty("error-come-path")
        String path,
        @JsonProperty("error-time")
        LocalDateTime timestamp) {
}
