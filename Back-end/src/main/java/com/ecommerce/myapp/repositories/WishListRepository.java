package com.ecommerce.myapp.repositories;

import com.ecommerce.myapp.model.client.ProductWish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface WishListRepository extends JpaRepository<ProductWish, Long> {
    @Query(value = """
            select * from wish_list
            where wish_list.user_id = ?1
            """, nativeQuery = true)
    Set<ProductWish> findAllByAppUser(Long id);

    @Query("SELECT COUNT(p) > 0 FROM ProductWish p WHERE p.product.productId = ?1")
    boolean existsByProductId(Long productId);
}