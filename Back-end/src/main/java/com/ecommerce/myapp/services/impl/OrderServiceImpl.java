package com.ecommerce.myapp.services.impl;

import com.ecommerce.myapp.dtos.dashboard.CategoryRevenueDto;
import com.ecommerce.myapp.dtos.dashboard.SalesDto;
import com.ecommerce.myapp.exceptions.OutOfStockException;
import com.ecommerce.myapp.exceptions.ResourceNotFoundException;
import com.ecommerce.myapp.model.checkoutGroup.Order;
import com.ecommerce.myapp.model.checkoutGroup.OrderDetail;
import com.ecommerce.myapp.model.checkoutGroup.OrderStatusV2;
import com.ecommerce.myapp.model.client.CartItem;
import com.ecommerce.myapp.model.client.UserAddress;
import com.ecommerce.myapp.model.group.Product;
import com.ecommerce.myapp.model.user.AppUser;
import com.ecommerce.myapp.repositories.*;
import com.ecommerce.myapp.services.OrderService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Slf4j
@AllArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {
    private final ProductRepository productRepository;
    private final UserAddressRepository userAddressRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;

    @Override
    public void createOrder(AppUser appUser, Set<CartItem> cartItems) {
        Set<Product> products = new HashSet<>();
        for (CartItem cartItem : cartItems) {
            Optional<Product> productOpt = cartItemRepository.getProduct(cartItem);
            if (productOpt.isPresent()) {
                Product product = productOpt.get();
                if (product.getStockQuantity() < cartItem.getQuantity()) {
                    throw new OutOfStockException(STR."Product \{product.getProductName()} is out of stock.");
                }
                products.add(product);
            }
        }
        Order order = new Order();
        order.setAppUser(appUser);
        Optional<UserAddress> userAddress = userAddressRepository.findAllByUserId(appUser.getUserId())
                .stream()
                .filter(UserAddress::getIsMainAddress)
                .findFirst();

        if (userAddress.isPresent()) {
            UserAddress address = userAddress.get();
            order.setReceiveAddress(address.getFullAddress());
            order.setReceivePhone(address.getPhone());
            order.setReceiveName(appUser.getFullName());
            LocalDateTime expectedReceivedDate = LocalDateTime.now().plusDays(4);
            order.setReceivedAt(expectedReceivedDate);
            order.setStatus(OrderStatusV2.WAITING);
            Order savedOrder = orderRepository.save(order);

            BigDecimal totalOrderPrice = BigDecimal.ZERO;
            for (Product product : products) {
                int quantity = cartItems.stream().filter(cartItem -> cartItem.getProduct().equals(product))
                        .findFirst()
                        .map(CartItem::getQuantity)
                        .orElse(0);

                OrderDetail orderDetail = OrderDetail.builder()
                        .product(product)
                        .productName(product.getProductName())
                        .unitPrice(product.getUnitPrice())
                        .order(savedOrder)
                        .orderQuantity(quantity)
                        .build();
                orderDetailRepository.save(orderDetail);
                totalOrderPrice = totalOrderPrice.add(product.getUnitPrice().multiply(BigDecimal.valueOf(quantity)));
                product.setStockQuantity(product.getStockQuantity() - quantity);
                productRepository.save(product);
            }
            order.setTotalPrice(totalOrderPrice);
        }
    }
    @Override
    public List<Order> findAllById(List<Long> orderIds) {
        return orderRepository.findAllById(orderIds);
    }

    @Override
    public Order findById(Long orderId) {
        return orderRepository.findById(orderId).orElseThrow(() ->
                new ResourceNotFoundException(STR."Order with ID \{orderId} can't found"));
    }

    @Override
    public List<Order> findAllByStatus(OrderStatusV2 statusV2) {
        return orderRepository.findAllByStatus(statusV2);
    }

    @Override
    public List<Order> getOrderHistoryByUser(AppUser appUser, OrderStatusV2 status) {
        if (status == null) {
            return orderRepository.findAllByAppUser(appUser);
        } else {
            return orderRepository.findAllByAppUserAndStatus(appUser, status);
        }
    }

    @Override
    public void cancelOrder(AppUser user, Long orderId) {
        if (orderId == null) {
            throw new RuntimeException("Order ID cannot be null");
        }
        Order order = orderRepository.findByAppUserAndOrderId(user, orderId).orElseThrow(
                () -> new ResourceNotFoundException(
                        STR."Order with ID \{orderId} of User with ID \{user.getUserId()} can't found !")
        );
        if (!order.getStatus().equals(OrderStatusV2.WAITING)) {
            throw new IllegalStateException(STR."Order with \{orderId} is not in a state that can be cancelled.");
        }
        order.setStatus(OrderStatusV2.CANCEL);
        orderRepository.save(order);
    }

    @Override
    public Page<Order> getAllOrder(String query, Pageable pageable) {
        return orderRepository.orderPage(query, pageable);
    }

    @Override
    public void updateStatus(Long orderId, OrderStatusV2 statusV2) {
        var order = findById(orderId);
        if (order.getStatus().equals(OrderStatusV2.SUCCESS))
            throw new IllegalStateException("The status of the order with the 'SUCCESS' status cannot be updated.");
        order.setStatus(statusV2);
        orderRepository.save(order);
    }

    @Override
    public SalesDto getSalesByTime(String dateA, String dateB) {
        return new SalesDto(
                orderRepository.countTotalPriceByTime(dateA, dateB),
                calculateGrowthRate(dateA, dateB));
    }

    @Override
    public Page<Product> bestSellerProducts(Pageable pageable) {
        return orderRepository.findAllBestSellerProduct(pageable);
    }

    @Override
    public List<CategoryRevenueDto> categoryRevenueDto() {
        return orderRepository.listCategoryRevenues();
    }

    private BigDecimal calculateGrowthRate(String fromA, String toB) {
        BigDecimal totalRevenueB = orderRepository.findTotalPriceAfterDate(fromA);
        BigDecimal totalRevenueA = orderRepository.findTotalPriceBeforeDate(toB);

        if (totalRevenueA == null || totalRevenueA.compareTo(BigDecimal.ZERO) == 0 ||
            totalRevenueB == null || totalRevenueB.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return totalRevenueB.subtract(totalRevenueA)
                .divide(totalRevenueA, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }
}
