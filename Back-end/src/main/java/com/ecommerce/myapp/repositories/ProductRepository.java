package com.ecommerce.myapp.repositories;


import com.ecommerce.myapp.dtos.product.response.ProductPriorityDTO;
import com.ecommerce.myapp.model.group.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE " +
           "(LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))and p.status = true")
    List<Product> searchAllByProductNameAndDescription(String search);

    @Query("SELECT p FROM Product p WHERE " +
           "(LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))and p.status = true ")
    Page<Product> getPageProduct(String search, Pageable pageable);

    Optional<Product> findByProductName(String productName);

    // featured-productIds
    @Query("SELECT new com.ecommerce.myapp.dtos.product.response." +
           "ProductPriorityDTO(p.productId, p.productName,p.unitPrice, COUNT(wl.product.productId)) " +
           "FROM Product p " +
           "INNER JOIN ProductWish wl ON wl.product = p " +
           "GROUP BY p.productId, p.productName " +
           "ORDER BY COUNT(wl.product.productId) DESC")
    Page<ProductPriorityDTO> featuredProducts(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.createdAt >= :weekAgo")
    Page<Product> newProducts(LocalDateTime weekAgo, Pageable pageable);

    @Query(value = """
            SELECT *
            FROM
                products p
            ORDER BY
                (SELECT COUNT(*) FROM order_details od WHERE od.product_id = p.product_id and p.status = true) DESC;
            """, nativeQuery = true)
    Page<Product> bestSellerProducts(Pageable pageable);

    @Query(value = """
            SELECT DISTINCT p.* FROM `ecommerce-test-db`.products p
            left join `ecommerce-test-db`.product_sizes ps
            ON p.product_id = ps.prod_id
            WHERE (:categoryId IS NULL OR p.category_id = :categoryId)
            AND (:price IS NULL OR p.unit_price <= :price OR (:price = 0 AND p.unit_price > 0))
            AND (ps.size_id IN :sizeIDs)
            AND p.status = true
            """, nativeQuery = true)
    Page<Product> findAllByFilter(@Param("categoryId") Long categoryId,
                                  @Param("price") BigDecimal price,
                                  @Param("sizeIDs") Set<Long> sizeIDs,
                                  Pageable pageable);

    @Query(value = """
            SELECT DISTINCT p.* FROM `ecommerce-test-db`.products p
            left join `ecommerce-test-db`.product_sizes ps
            ON p.product_id = ps.prod_id
            WHERE (:categoryId IS NULL OR p.category_id = :categoryId)
            AND (:price IS NULL OR p.unit_price <= :price OR (:price = 0 AND p.unit_price > 0))
            AND p.status = true
            """, nativeQuery = true)
    Page<Product> findAllByFilterExcludingSize(@Param("categoryId") Long categoryId,
                                               @Param("price") BigDecimal price,
                                               Pageable pageable);
}