package com.ecommerce.myapp.repositories;

import com.ecommerce.myapp.model.group.Category;
import com.ecommerce.myapp.model.group.CategoryImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryImageRepository extends JpaRepository<CategoryImage, Long> {
    List<CategoryImage> findAllByCategory(Category category);

    Optional<CategoryImage> findByCategory(Category category);

    @Modifying
    @Query("delete from CategoryImage c where c.category.id = ?1")
    void deleteByCategoryId(Long id);
}