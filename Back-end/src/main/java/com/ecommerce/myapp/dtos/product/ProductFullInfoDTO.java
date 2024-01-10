package com.ecommerce.myapp.dtos.product;

import com.ecommerce.myapp.model.group.Product;
import com.ecommerce.myapp.model.group.ProductImage;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/**
 * DTO for {@link Product}
 */
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public record ProductFullInfoDTO(
        Long productId,
        String sku,
        @NotBlank(message = "Product name cannot be blank")
        @Size(max = 255, message = "Product name must not exceed 255 characters")
        String productName,
        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,

        @NotNull
        String stringSizes,

        @NotNull(message = "Unit price cannot be null")
        @DecimalMin(value = "0.0", inclusive = false, message = "Unit price must be greater than 0")
        BigDecimal unitPrice,
        @NotNull(message = "Stock quantity cannot be null")
        @Min(value = 0, message = "Stock quantity cannot be negative")
        Integer stockQuantity,
        @NotNull(message = "Category cannot be null")
        Long categoryId,
        @NotNull(message = "Status cannot be null")
        Boolean status,
        Set<ProductImage> productImages,
        List<MultipartFile> imageFiles

) implements Serializable {
}