package com.ecommerce.myapp.dtos.category;


import com.ecommerce.myapp.model.group.Category;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * DTO for {@link Category}
 */
public record ParentCategoryDto(
        @NotNull Integer id,
        String categoryName) implements Serializable {
}