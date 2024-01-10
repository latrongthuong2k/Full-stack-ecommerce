package com.ecommerce.myapp.repositories;

import com.ecommerce.myapp.model.client.ShoppingCart;
import com.ecommerce.myapp.model.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, Long> {
    Optional<ShoppingCart> findByAppUser(AppUser appUser);
}