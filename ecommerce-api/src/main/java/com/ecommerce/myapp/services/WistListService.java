package com.ecommerce.myapp.services;

import com.ecommerce.myapp.model.client.ProductWish;
import com.ecommerce.myapp.model.user.AppUser;

import java.util.List;

public interface WistListService {

    void createWishList(AppUser appUser, List<Long> productId);


    List<ProductWish> getWishListProducts(AppUser appUser);

    void deleteItem(AppUser appUser, Long wishListId);
}
