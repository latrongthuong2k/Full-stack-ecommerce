package com.ecommerce.myapp.controller.Admin;

import com.ecommerce.myapp.dtos.dashboard.CategoryRevenueDto;
import com.ecommerce.myapp.dtos.dashboard.SalesDto;
import com.ecommerce.myapp.dtos.dashboard.TimeDto;
import com.ecommerce.myapp.dtos.product.mappers.ProductSimpleMapper;
import com.ecommerce.myapp.dtos.product.response.ResSimpleInfoProductDto;
import com.ecommerce.myapp.model.group.Product;
import com.ecommerce.myapp.services.OrderService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/management/dashboard")
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
public class DashboardManagementController {
    private final OrderService orderService;
    private final ProductSimpleMapper productSimpleMapper;

    @GetMapping("/sales")
    public ResponseEntity<SalesDto> getSales( @Valid @RequestBody TimeDto timeDto){
        return ResponseEntity.ok(orderService.getSalesByTime(timeDto.from(), timeDto.to()));
    }

    @GetMapping("/best-seller-products")
    public ResponseEntity<Map<String, Object>> getSales(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size
    ){
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = orderService.bestSellerProducts(pageable);
        Page<ResSimpleInfoProductDto> productDtoPage = products.map(productSimpleMapper::toDto);
        var response = objectMap(productDtoPage);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/sales/categories")
    public ResponseEntity<List<CategoryRevenueDto>> getSales(
    ){
        List<CategoryRevenueDto> categoryRevenueDto = orderService.categoryRevenueDto();
        return ResponseEntity.ok(categoryRevenueDto);
    }
    private Map<String, Object> objectMap(Page<ResSimpleInfoProductDto> productPage) {
        Map<String, Object> response = new HashMap<>();
        response.put("content", productPage.getContent());
        // response.put("currentPage", productPage.getNumber());
        // response.put("totalItems", productPage.getTotalElements());
        response.put("totalPages", productPage.getTotalPages());
        return response;
    }

}
