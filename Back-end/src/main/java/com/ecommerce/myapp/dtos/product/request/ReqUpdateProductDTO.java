package com.ecommerce.myapp.dtos.product.request;

import com.ecommerce.myapp.model.group.Product;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link Product}
 */
public record ReqUpdateProductDTO(
        @NotNull @Size(max = 100) String productName,
        @NotNull BigDecimal price,
        @NotNull Integer stockQuantity,
        @NotNull Integer categoryId,
        @NotNull Integer supplierId,
        @Size(max = 200) String description
) implements Serializable {
}