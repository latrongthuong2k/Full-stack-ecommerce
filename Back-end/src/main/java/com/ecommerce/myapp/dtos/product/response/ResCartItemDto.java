package com.ecommerce.myapp.dtos.product.response;


import com.ecommerce.myapp.model.group.Product;
import com.ecommerce.myapp.s3.S3ProductImages;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Set;

/**
 * DTO for {@link Product}
 */
public record ResCartItemDto(
        Long productId,
        String productName,
        String sku,
        BigDecimal unitPrice,
        BigDecimal totalPrice,
        Integer quantity,
        String sizeLabel,
        Set<S3ProductImages> s3ProductImages
) implements Serializable {
}