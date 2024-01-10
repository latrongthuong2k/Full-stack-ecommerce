package com.ecommerce.myapp.dtos.dashboard;

import java.io.Serializable;
import java.math.BigDecimal;

public record CategoryRevenueDto(
        String categoryName,
        BigDecimal totalRevenue
) implements Serializable {
}