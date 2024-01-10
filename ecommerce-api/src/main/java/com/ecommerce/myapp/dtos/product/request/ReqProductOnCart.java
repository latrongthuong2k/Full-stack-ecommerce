package com.ecommerce.myapp.dtos.product.request;

import com.ecommerce.myapp.model.group.Product;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.io.Serializable;

/**
 * DTO for {@link Product}
 */
public record ReqProductOnCart(
        @NotNull(message = "Product ID cannot be null")
        @Positive(message = "Product ID must be positive")
        Long productId,
        @NotNull(message = "Stock quantity cannot be null")
        @Min(value = 0, message = "Stock quantity cannot be negative")
        @NotNull Integer quantity,

        @NotBlank String sizeLabel
) implements Serializable {
}