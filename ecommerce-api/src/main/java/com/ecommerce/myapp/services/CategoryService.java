package com.ecommerce.myapp.services;

import com.ecommerce.myapp.dtos.category.CategoryDto;
import com.ecommerce.myapp.dtos.category.request.ReqCreateCategory;
import com.ecommerce.myapp.model.group.Category;
import com.ecommerce.myapp.model.group.CategoryImage;
import com.ecommerce.myapp.s3.S3ProductImages;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface CategoryService {
    void saveCategory(ReqCreateCategory reqCreateCategory);

    List<Category> getAllCategory();

    CategoryImage getCategoryImage(Category category);

    List<Category> getAllCategoryExceptFather(Long cateId, Long parentId);


    Page<Category> getCategoryPage(String query, Pageable pageable);

    void updateCategoryById(CategoryDto categoryDto);

    void deleteById(Long id);

    Category findById(Long categoryId);

    boolean checkCategoryExistence(Long categoryId);

    Category getCategory(Long categoryId);

    void addCategoryImage(Category category, MultipartFile files, String bucketName);

    void deleteS3Image(Category category, String bucketName);

    S3ProductImages getImageByID(Category category, String bucketName);

}
