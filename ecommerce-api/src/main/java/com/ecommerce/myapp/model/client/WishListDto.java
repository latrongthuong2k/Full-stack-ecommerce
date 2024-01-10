package com.ecommerce.myapp.model.client;

import com.ecommerce.myapp.dtos.product.response.ResSimpleInfoProductDto;

import java.io.Serializable;

/**
 * DTO for {@link ProductWish}
 */
public record WishListDto(Long id, ResSimpleInfoProductDto product) implements Serializable {
}