package com.ecommerce.myapp.dtos.cart.Address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

/**
 * DTO for {@link com.ecommerce.myapp.model.client.UserAddress}
 */
public record UserAddressDto(
        Long id,
        @NotNull(message = "isMainAddress can't be null")
        Boolean isMainAddress,
        @Size(message = "Minimum character is 1 and maximum 255", min = 1, max = 255) @NotBlank(message = "Address can't be empty")
        String fullAddress,
        String phone,
        @Size(message = "Max character is 255 ", max = 255)
        @NotBlank(message = "receiveName can't be blank")
        String receiveName
) implements Serializable {
}