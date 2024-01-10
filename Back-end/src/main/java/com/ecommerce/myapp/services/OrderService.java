package com.ecommerce.myapp.services;

import com.ecommerce.myapp.dtos.dashboard.CategoryRevenueDto;
import com.ecommerce.myapp.dtos.dashboard.SalesDto;
import com.ecommerce.myapp.model.checkoutGroup.Order;
import com.ecommerce.myapp.model.checkoutGroup.OrderStatusV2;
import com.ecommerce.myapp.model.client.CartItem;
import com.ecommerce.myapp.model.group.Product;
import com.ecommerce.myapp.model.user.AppUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface OrderService {
    void createOrder(AppUser appUser, Set<CartItem> cartItems);

    List<Order> findAllById(List<Long> orderIds);

    Order findById(Long orderId);

    List<Order> findAllByStatus(OrderStatusV2 statusV2);

    List<Order> getOrderHistoryByUser(AppUser appUser, OrderStatusV2 status);

    void cancelOrder(AppUser user, Long orderId);

    Page<Order> getAllOrder(String query, Pageable pageable);

    void updateStatus(Long orderId, OrderStatusV2 statusV2);

    SalesDto getSalesByTime(String from, String to);

    Page<Product> bestSellerProducts(Pageable pageable);

    List<CategoryRevenueDto> categoryRevenueDto();
}
