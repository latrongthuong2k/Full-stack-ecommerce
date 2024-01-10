package com.ecommerce.myapp.dtos.category.response;

import com.ecommerce.myapp.model.group.Category;
import com.ecommerce.myapp.s3.S3ProductImages;

import java.io.Serializable;

/**
 * DTO for {@link Category}
 */

public record ResCategory(
        Long id,
        String categoryName,
        S3ProductImages s3ProductImages
) implements Serializable {
}