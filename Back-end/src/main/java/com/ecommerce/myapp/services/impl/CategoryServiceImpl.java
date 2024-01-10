package com.ecommerce.myapp.services.impl;

import com.ecommerce.myapp.dtos.category.CategoryDto;
import com.ecommerce.myapp.dtos.category.mappers.CategoryFullMapper;
import com.ecommerce.myapp.dtos.category.mappers.CategoryMapper;
import com.ecommerce.myapp.dtos.category.request.ReqCreateCategory;
import com.ecommerce.myapp.exceptions.CannotDeleteException;
import com.ecommerce.myapp.exceptions.DuplicateResourceException;
import com.ecommerce.myapp.exceptions.ResourceNotFoundException;
import com.ecommerce.myapp.model.group.Category;
import com.ecommerce.myapp.model.group.CategoryImage;
import com.ecommerce.myapp.repositories.CategoryImageRepository;
import com.ecommerce.myapp.repositories.CategoryRepository;
import com.ecommerce.myapp.s3.S3Buckets;
import com.ecommerce.myapp.s3.S3ProductImages;
import com.ecommerce.myapp.s3.S3Service;
import com.ecommerce.myapp.services.CategoryService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
@AllArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {
    private final CategoryImageRepository categoryImageRepository;
    private final CategoryRepository categoryRepository;
    private final S3Service s3Service;
    private S3Buckets s3Buckets;
    private final CategoryFullMapper categoryFullMapper;
    private final CategoryMapper categoryMapper;


    // save new category
    @Override
    public void saveCategory(ReqCreateCategory reqCreateCategory) {
        boolean checkExitsName = categoryRepository.existsByCategoryName(reqCreateCategory.categoryName());
        if (checkExitsName) {
            throw new DuplicateResourceException("Category is exist, please input another category name");
        }
        Category categoryNew = categoryMapper.toEntity(reqCreateCategory);
        var saved = categoryRepository.save(categoryNew);
        if (reqCreateCategory.imageFiles() != null && !reqCreateCategory.imageFiles().isEmpty()) {
            addCategoryImage(saved, reqCreateCategory.imageFiles().getFirst(), s3Buckets.getCategoryBucket());
        }
    }

    // Get list all category
    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findAll();
    }

    @Override
    public CategoryImage getCategoryImage(Category category) {
        return categoryImageRepository.findByCategory(category).orElse(null);
    }

    @Override
    public List<Category> getAllCategoryExceptFather(Long cateId, Long parentId) {
        return categoryRepository.findAllExcept(cateId, parentId);
    }

    // pagination
    @Override
    public Page<Category> getCategoryPage(String query, Pageable pageable) {
        return categoryRepository.findByCategoryNameContainingIgnoreCase(query, pageable);
    }


    @Override
    public void updateCategoryById(CategoryDto categoryDto) {
        Category category = foundCategory(categoryDto.id());
        Category updatedCategory = categoryFullMapper.partialUpdate(categoryDto, category);
        categoryImageRepository.deleteByCategoryId(categoryDto.id());
        if (categoryDto.imageFile() != null && !categoryDto.imageFile().isEmpty() ) {
            addCategoryImage(category, categoryDto.imageFile().getFirst(), s3Buckets.getCategoryBucket());
        }
        categoryRepository.save(updatedCategory);
    }


    @Override
    public void deleteById(Long id) {
        Category category = getCategory(id);
        if (!category.getProducts().isEmpty()) {
            throw new CannotDeleteException("Cannot delete category as it contains products");
        }
        deleteS3Image(category, s3Buckets.getCategoryBucket());
        categoryRepository.deleteById(category.getId());
    }

    @Override
    public Category findById(Long categoryId) {
        return foundCategory(categoryId);
    }

    @Override
    public boolean checkCategoryExistence(Long categoryId) {
        var isFound = categoryRepository.existsById(categoryId);
        if (!isFound)
            throw new ResourceNotFoundException("Category is not exist");
        return true;
    }

    @Override
    public Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId).orElseThrow(
                () -> new ResourceNotFoundException(STR."No category found with id: \{categoryId}"));
    }

    @Override
    public void addCategoryImage(Category category, MultipartFile file, String bucketName) {
        String key = UUID.randomUUID().toString();
        try {
            String imageCode = "category-images/%s/%s".formatted(category.getId(), key);
            s3Service.putObject(
                    bucketName,
                    imageCode,
                    file.getBytes()
            );
            List<CategoryImage> categoryImages = categoryImageRepository.findAllByCategory(category);
            categoryImages.add(CategoryImage.builder().category(category).Key(imageCode).build());
            categoryImageRepository.saveAll(categoryImages);
        } catch (IOException e) {
            throw new RuntimeException(String.format("failed to upload image with category key : %s", key), e);
        }
        categoryRepository.save(category);
    }

    @Override
    public void deleteS3Image(Category category, String bucketName) {
        Optional<CategoryImage> categoryImage = categoryImageRepository.findByCategory(category);
        if (categoryImage.isEmpty()) {
            throw new ResourceNotFoundException("Image not found");
        }
        String imageCode = "productIds-images/%s/%s".formatted(category.getId(), categoryImage.get().getKey());
        s3Service.deleteObject(
                bucketName,
                imageCode
        );
    }


    @Override
    public S3ProductImages getImageByID(Category category, String bucketName) {
        Optional<CategoryImage> categoryImage = categoryImageRepository.findByCategory(category);
        if (categoryImage.isEmpty()) {
            throw new ResourceNotFoundException("Image not found");
        }
        String s3Key = "category-images/%s/%s".formatted(category.getId(), categoryImage.get().getKey());
        // S3からURLを取得する
        return s3Service.getObjectUrl(bucketName, s3Key);
    }

//----------------------

    private Category foundCategory(Long categoryId) {
        return categoryRepository.findById(categoryId).orElseThrow(
                () -> new ResourceNotFoundException(STR."No category found with id: \{categoryId}"));
    }
}
