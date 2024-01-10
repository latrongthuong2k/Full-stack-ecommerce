package com.ecommerce.myapp.repositories;

import com.ecommerce.myapp.model.group.Product;
import com.ecommerce.myapp.model.group.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    Set<ProductImage> findByProduct(Product product);

    @Query("select p from ProductImage p where p.product.productId = ?1 and p.isPrimary = true")
    Optional<ProductImage> findMainImage(Long product);

}