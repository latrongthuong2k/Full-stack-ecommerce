package com.ecommerce.myapp.dtos.product.response;


import com.ecommerce.myapp.model.group.Product;
import com.ecommerce.myapp.model.group.Size;
import com.ecommerce.myapp.s3.S3ProductImages;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/**
 * DTO for {@link Product}
 */
public record ResSimpleInfoProductDto(
        Long productId,
        String productName,
        BigDecimal unitPrice,
        List<Size> sizes,
        Set<S3ProductImages> s3ProductImages
) implements Serializable {
}