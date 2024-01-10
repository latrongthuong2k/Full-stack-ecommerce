package com.ecommerce.myapp.dtos.product.response;

import com.ecommerce.myapp.model.group.Product;
import com.ecommerce.myapp.model.group.Size;
import com.ecommerce.myapp.s3.S3ProductImagesDetail;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

/**
 * DTO for {@link Product}
 */
@Setter
@Getter
public class ResProductDetailDTO implements Serializable {
    Long productId;
    String sku;
    String productName;
    String description;
    BigDecimal unitPrice;
    Integer stockQuantity;
    Boolean status;
    Set<S3ProductImagesDetail> productImages;
    List<Size> sizes;
}