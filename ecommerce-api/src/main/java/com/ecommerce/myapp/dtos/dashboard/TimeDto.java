package com.ecommerce.myapp.dtos.dashboard;

import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

public record TimeDto(
        @NotBlank
        String from,
        @NotBlank
        String to
) implements Serializable {
}