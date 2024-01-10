package com.ecommerce.myapp.model.client;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link ProductWish}
 */
public record WishListReq(List<Long> productIds) implements Serializable {
}