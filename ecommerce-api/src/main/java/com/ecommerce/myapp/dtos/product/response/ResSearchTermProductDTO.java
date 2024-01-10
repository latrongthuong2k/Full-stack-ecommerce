package com.ecommerce.myapp.dtos.product.response;


import com.ecommerce.myapp.model.group.Product;

import java.io.Serializable;

/**
 * DTO for {@link Product}
 */
public record ResSearchTermProductDTO(
        Long productId,
        String productName
) implements Serializable {
}