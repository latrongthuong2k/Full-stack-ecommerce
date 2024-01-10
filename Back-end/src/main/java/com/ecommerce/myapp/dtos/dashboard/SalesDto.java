package com.ecommerce.myapp.dtos.dashboard;

import java.io.Serializable;
import java.math.BigDecimal;

public record SalesDto(
        BigDecimal totalByTime,
        BigDecimal growthRate

) implements Serializable {
}