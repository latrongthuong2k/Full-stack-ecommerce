package com.ecommerce.myapp.services.impl;

import com.ecommerce.myapp.exceptions.CannotDeleteException;
import com.ecommerce.myapp.model.client.ProductWish;
import com.ecommerce.myapp.model.user.AppUser;
import com.ecommerce.myapp.repositories.WishListRepository;
import com.ecommerce.myapp.services.ProductService;
import com.ecommerce.myapp.services.WistListService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class WishListServiceImpl implements WistListService {
    private final ProductService productService;

    private final WishListRepository wishListRepository;

    @Override
    public void createWishList(AppUser appUser, List<Long> productIds) {
        Set<ProductWish> userProductWishes = new HashSet<>();
        // true
        var products = productService.findAllByIds(productIds);
        products.forEach(product -> {
            if (!wishListRepository.existsByProductId(product.getProductId())) {
                ProductWish productWish = new ProductWish();
                productWish.setAppUser(appUser);
                productWish.setProduct(product);
                userProductWishes.add(productWish);
            }
        });
        // Lưu những sản phẩm mới
        wishListRepository.saveAll(userProductWishes);
        Set<ProductWish> currentWishes = wishListRepository.findAllByAppUser(appUser.getUserId());
        // xoá những wishlist đã bỏ chọn
        List<ProductWish> toRemove = currentWishes.stream()
                .filter(wish -> !productIds.contains(wish.getProduct().getProductId())).toList();
        wishListRepository.deleteAll(toRemove);
    }

    private Set<ProductWish> getWishLists(AppUser appUser) {
        return wishListRepository.findAllByAppUser(appUser.getUserId());
    }

    @Override
    public List<ProductWish> getWishListProducts(AppUser appUser) {
        Set<ProductWish> wishList = getWishLists(appUser);
        List<Long> ids = wishList.stream().map(ProductWish::getId).toList();
        return wishListRepository.findAllById(ids);
    }


    @Override
    public void deleteItem(AppUser appUser, Long wishListId) {
        Set<ProductWish> userProductWishes = getWishLists(appUser);
        ProductWish wishToDelete = userProductWishes.stream()
                .filter(wish -> wish.getId().equals(wishListId))
                .findFirst()
                .orElse(null);
        if (wishToDelete != null) {
            wishListRepository.deleteById(wishToDelete.getId());
        } else {
            throw new CannotDeleteException("Wishlist item not found or does not belong to the user");
        }
    }
}
