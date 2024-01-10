package com.ecommerce.myapp.controller.Admin;

import com.ecommerce.myapp.dtos.cart.order.OrderMapper;
import com.ecommerce.myapp.dtos.cart.order.OrderSimpleMapper;
import com.ecommerce.myapp.dtos.cart.order.response.OrderDto;
import com.ecommerce.myapp.dtos.cart.order.response.OrderSimpleInfoDto;
import com.ecommerce.myapp.dtos.cart.request.OrderUpdateReq;
import com.ecommerce.myapp.model.checkoutGroup.Order;
import com.ecommerce.myapp.model.checkoutGroup.OrderStatusV2;
import com.ecommerce.myapp.services.OrderService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/management/order")
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
public class OrdersManagementController {
    private final OrderService orderService;
    private final OrderMapper orderMapper;
    private final OrderSimpleMapper orderSimpleMapper;

    // page
//    @Cacheable(value = "order-table", key = "{#page,#sortField,#sortDir,#query}",
//            condition = "#query.length() > 3")
    @GetMapping("/order-table")
    public ResponseEntity<Map<String, Object>> getOrderTable(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @RequestParam(name = "q", defaultValue = "") String query,
            @RequestParam(name = "sortField", defaultValue = "orderAt") String sortField,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir.equals("asc") ?
                Sort.Direction.ASC : Sort.Direction.DESC, sortField));
        Page<Order> orders = orderService.getAllOrder(query, pageable);
        Page<OrderSimpleInfoDto> pageOrder = orders.map(orderSimpleMapper::toDto);
        Map<String, Object> response = new HashMap<>();
        response.put("content", pageOrder.getContent());
        response.put("totalPages", pageOrder.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{order-status}")
    public ResponseEntity<List<OrderSimpleInfoDto>> getOrdersByStatus(@PathVariable("order-status") String status) {
        List<OrderSimpleInfoDto> response = orderService.findAllByStatus(OrderStatusV2.fromString(status)).stream().map(orderSimpleMapper::toDto).toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get-detail/{orderId}")
    public ResponseEntity<OrderDto> getOrderDetail(@PathVariable("orderId") Long orderId) {
        return ResponseEntity.ok(orderMapper.toDto(orderService.findById(orderId)));
    }

    @CacheEvict(value = "order-table", allEntries = true)
    @PutMapping("/update/{orderId}")
    public ResponseEntity<String> updateCategory(
            @PathVariable("orderId") Long orderId, @Valid @RequestBody OrderUpdateReq updateReq
    ) {
        OrderStatusV2 orderStatusV2 = OrderStatusV2.fromString(updateReq.orderStatus());
        orderService.updateStatus(orderId, orderStatusV2);
        return ResponseEntity.ok().body("Status updated successfully");
    }

}
