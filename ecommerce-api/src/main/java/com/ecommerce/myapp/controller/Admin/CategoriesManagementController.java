package com.ecommerce.myapp.controller.Admin;

import com.ecommerce.myapp.dtos.category.CategoryDto;
import com.ecommerce.myapp.dtos.category.mappers.CategoryFullMapper;
import com.ecommerce.myapp.dtos.category.mappers.CategoryMapper;
import com.ecommerce.myapp.dtos.category.request.ReqCreateCategory;
import com.ecommerce.myapp.dtos.category.response.ResCategory;
import com.ecommerce.myapp.model.group.Category;
import com.ecommerce.myapp.services.CategoryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/management/categories")
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
public class CategoriesManagementController {
    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;
    private final CategoryFullMapper categoryFullMapper;

    // page
    @Cacheable(value = "category-table", key = "{#page,#sortField,#sortDir,#query}",
            condition = "#query.length() > 3")
    @GetMapping("/category-table")
    public ResponseEntity<Map<String, Object>> getCategoryPage(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @RequestParam(name = "q", defaultValue = "") String query,
            @RequestParam(name = "sortField", defaultValue = "categoryName") String sortField,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortField));
        Page<Category> categories = categoryService.getCategoryPage(query, pageable);
        Page<CategoryDto> pageCategories = categories.map(categoryFullMapper::toDto);
        Map<String, Object> response = new HashMap<>();
        response.put("categories", pageCategories.getContent());
        response.put("totalPages", pageCategories.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get/{categoryId}")
    public ResponseEntity<ResCategory> getCategoryById(@PathVariable("categoryId") Long id) {
        return ResponseEntity.ok(categoryMapper.toDto(categoryService.findById(id)));
    }

    @GetMapping("/get-detail/{categoryId}")
    public ResponseEntity<CategoryDto> getDetailCate(@PathVariable("categoryId") Long id) {
        return ResponseEntity.ok(categoryFullMapper.toDto(categoryService.findById(id)));
    }

    @CacheEvict(value = {"category-table", "all-categories"}, allEntries = true)
    @PostMapping("/create")
    public ResponseEntity<Void> createCategory(@Valid @ModelAttribute ReqCreateCategory category) {
        categoryService.saveCategory(category);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @CacheEvict(value = {"category-table", "all-categories"}, allEntries = true)
    @PutMapping("/update")
    public ResponseEntity<String> updateCategory(@Valid @ModelAttribute CategoryDto categoryDto) {
        categoryService.updateCategoryById(categoryDto);
        return ResponseEntity.ok().body("Category updated successfully");
    }

    // dùng cho việc khác
    @GetMapping("/get-all")
    public ResponseEntity<List<ResCategory>> getAllExceptFather(@RequestParam("categoryId") Long id,
                                                                @RequestParam("parentId") Long parentId) {
        var response = categoryService.getAllCategoryExceptFather(id, parentId)
                .stream().map(categoryMapper::toDto).toList();
        return ResponseEntity.ok(response);
    }

    @CacheEvict(value = {"category-table", "all-categories"}, allEntries = true)
    @DeleteMapping("/delete/{categoryId}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteById(categoryId);
        return ResponseEntity.ok().body("Category deleted successfully");
    }
}
