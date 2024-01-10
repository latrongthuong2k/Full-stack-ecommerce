package com.ecommerce.myapp.model.user;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * DTO for {@link com.ecommerce.myapp.model.client.UserAddress}
 */
public record UserAddressDto(@NotNull Long id, @NotNull Boolean isMainAddress, @NotNull @NotEmpty String fullAddress,
                             String phone, @NotEmpty String receiveName) implements Serializable {
}