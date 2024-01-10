package com.ecommerce.myapp.dtos.cart.request;

import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

public record OrderUpdateReq(
        @NotBlank
        String orderStatus
) implements Serializable {
}