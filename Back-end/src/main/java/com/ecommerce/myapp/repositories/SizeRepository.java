package com.ecommerce.myapp.repositories;

import com.ecommerce.myapp.model.group.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SizeRepository extends JpaRepository<Size, Long> {

    //    @Query("select s from Size s join  where  = ?1")
    @Query(value = """
            select * FROM sizes s
            inner join product_sizes ps
            on s.id = ps.size_id
            where ps.prod_id = ?1
            """, nativeQuery = true)
    List<Size> findAllByProdId(Long prodId);

    @Modifying
    @Query(value = """
            delete FROM product_sizes ps
            where ps.prod_id = ?1
            """, nativeQuery = true)
    void deleteAllByProductId(Long productId);
}