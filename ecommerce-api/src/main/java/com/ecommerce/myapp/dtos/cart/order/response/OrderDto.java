package com.ecommerce.myapp.dtos.cart.order.response;

import com.ecommerce.myapp.model.checkoutGroup.OrderStatusV2;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for {@link com.ecommerce.myapp.model.checkoutGroup.Order}
 */
public record OrderDto(
        Long orderId,
        String serialNumber,
        LocalDateTime orderAt,
        BigDecimal totalPrice,
        OrderStatusV2 status,
        String note,
        String receiveName,
        String receiveAddress,
        String receivePhone,
        LocalDateTime receivedAt,
        Set<OrderDetailDto> orderDetails
) implements Serializable {
}