package com.ecommerce.myapp.controller.client;


import com.ecommerce.myapp.dtos.category.response.ResCategory;
import com.ecommerce.myapp.model.group.CategoryImage;
import com.ecommerce.myapp.s3.S3Buckets;
import com.ecommerce.myapp.s3.S3Service;
import com.ecommerce.myapp.services.CategoryService;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/client/category")
public class CategoryController {
    private final CategoryService categoryService;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;


    @CacheEvict(value = "all-categories")
    @GetMapping("/categories")
    public List<ResCategory> categories() {
        return categoryService.getAllCategory().stream().map(category -> {
            CategoryImage categoryImage = categoryService.getCategoryImage(category);
            if (categoryImage != null)
                return new ResCategory(
                        category.getId(),
                        category.getCategoryName(),
                        s3Service.getObjectUrl(s3Buckets.getCategoryBucket(), categoryImage.getKey())
                );
            else
                return new ResCategory(
                        category.getId(),
                        category.getCategoryName(),
                        null
                );
        }).toList();
    }
}
