package com.ecommerce.myapp.repositories;

import com.ecommerce.myapp.model.client.CartItem;
import com.ecommerce.myapp.model.client.ShoppingCart;
import com.ecommerce.myapp.model.group.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Set<CartItem> findAllByCart(ShoppingCart shoppingCart);

    @Query("select (count(c) > 0) from CartItem c where c.product.productId = ?1 and c.cart.id = ?2 ")
    boolean existsByProductIdAndCartId(Long productId, Long cartId);

    @Query("select c.product from CartItem c where c = ?1")
    Optional<Product> getProduct(CartItem cartItem);

    @Modifying
    @Query("delete from CartItem c where c.product.productId = ?1 and c.cart.id = ?2 and c.sizeLabel = ?3")
    void deleteByProductIdAndSize(Long productId, Long userCartId, String sizeLabel);

    void deleteAllByCart(ShoppingCart shoppingCart);
}