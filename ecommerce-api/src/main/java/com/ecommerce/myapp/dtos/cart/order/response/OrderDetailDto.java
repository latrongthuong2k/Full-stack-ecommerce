package com.ecommerce.myapp.dtos.cart.order.response;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * DTO for {@link com.ecommerce.myapp.model.checkoutGroup.OrderDetail}
 */
public record OrderDetailDto(
        Long id,
        String productName,
        BigDecimal unitPrice,
        Integer orderQuantity
) implements Serializable {
}