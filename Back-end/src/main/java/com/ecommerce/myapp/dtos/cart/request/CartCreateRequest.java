package com.ecommerce.myapp.dtos.cart.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;

public record CartCreateRequest(
        @NotNull(message = "User ID cannot be null")
        @Positive(message = "User ID must be positive")
        Long userId
) implements Serializable {
}