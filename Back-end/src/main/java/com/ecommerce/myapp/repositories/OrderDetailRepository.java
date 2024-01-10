package com.ecommerce.myapp.repositories;

import com.ecommerce.myapp.model.checkoutGroup.Order;
import com.ecommerce.myapp.model.checkoutGroup.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    Set<OrderDetail> findByOrder(Order order);
}