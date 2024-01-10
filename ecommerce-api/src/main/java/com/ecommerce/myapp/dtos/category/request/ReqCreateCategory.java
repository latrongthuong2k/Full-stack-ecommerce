package com.ecommerce.myapp.dtos.category.request;

import com.ecommerce.myapp.model.group.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link Category}
 */
public record ReqCreateCategory(
        @Size(max = 255, message = "Category name must not exceed 255 characters")
        @NotBlank(message = "Category name cannot be blank")
        String categoryName,
        @Size(max = 100, message = "Description must not exceed 100 characters")
        String description,
        @NotNull(message = "Status cannot be null")
        Boolean status,

        @Size(min = 1, max = 1, message = "You must upload exactly one file")
        @NotNull
        List<MultipartFile> imageFiles
) implements Serializable {
}