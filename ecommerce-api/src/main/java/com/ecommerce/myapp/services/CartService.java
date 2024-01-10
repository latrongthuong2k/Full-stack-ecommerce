package com.ecommerce.myapp.services;

import com.ecommerce.myapp.dtos.product.request.ReqProductOnCart;
import com.ecommerce.myapp.model.client.CartItem;
import com.ecommerce.myapp.model.client.ShoppingCart;
import com.ecommerce.myapp.model.group.Product;
import com.ecommerce.myapp.model.user.AppUser;

import java.util.List;
import java.util.Set;

public interface CartService {

    ShoppingCart getUserCart(AppUser appUser);

    void createCart(AppUser user);

    Set<Product> getAllProduct(AppUser user);

    void addProductToCart(AppUser user, List<ReqProductOnCart> reqProductOnCarts);

    void updateCartItem(AppUser user, Long productId, Integer quantity);

    void deleteCartItem(AppUser currentAuditor, Long productId, String sizeLabel);

    Set<CartItem> getCartItems(AppUser user);

    void cleanCartItems(AppUser currentAuditor);

    void checkOut(AppUser currentAuditor);
}
