package com.ecommerce.myapp.dtos.product.response;


import com.ecommerce.myapp.model.group.Product;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link Product}
 */
public record ProductPriorityDTO(
        Long productId,
        String productName,
        BigDecimal unitPrice,
        Long getWishlistCount
) implements Serializable {
}