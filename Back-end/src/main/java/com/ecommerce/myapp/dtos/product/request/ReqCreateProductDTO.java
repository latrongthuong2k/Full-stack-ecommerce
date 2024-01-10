package com.ecommerce.myapp.dtos.product.request;

import com.ecommerce.myapp.model.group.Category;
import com.ecommerce.myapp.model.group.Product;
import jakarta.validation.constraints.*;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link Product}
 */
public record ReqCreateProductDTO(
        @NotBlank(message = "Product name cannot be blank")
        @Size(max = 255, message = "Product name must not exceed 255 characters")
        String productName,
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,
        @NotNull(message = "Unit price cannot be null")
        @DecimalMin(value = "0.0", inclusive = false, message = "Unit price must be greater than 0")
        BigDecimal unitPrice,
        @NotNull(message = "Stock quantity cannot be null")
        @Min(value = 0, message = "Stock quantity cannot be negative")
        Integer stockQuantity,
        @NotNull(message = "Category cannot be null")
        Category category,
        @NotNull(message = "Status cannot be null")
        Boolean status

) implements Serializable {
}