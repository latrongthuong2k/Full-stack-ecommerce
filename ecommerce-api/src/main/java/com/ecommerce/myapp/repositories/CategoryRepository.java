package com.ecommerce.myapp.repositories;

import com.ecommerce.myapp.model.group.Category;
import com.ecommerce.myapp.model.group.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByCategoryName(String cateName);

    Page<Category> findByCategoryNameContainingIgnoreCase(String categoryName, Pageable pageable);

    Optional<Category> findByCategoryName(String categoryName);

    @Query("select c from Category c where c.id != ?1 and c.id != ?2")
    List<Category> findAllExcept(Long id, Long parentId);


    // support
    @Query("select c.products from Category c where c.id = ?1")
    Page<Product> products(Long categoryId, Pageable pageable);
}