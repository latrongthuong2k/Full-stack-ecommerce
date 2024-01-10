package com.ecommerce.myapp.dtos.editDtos;

import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

public record UserActionRequest (
        @NotNull
        Long userId,
        String role
) implements Serializable {
}
