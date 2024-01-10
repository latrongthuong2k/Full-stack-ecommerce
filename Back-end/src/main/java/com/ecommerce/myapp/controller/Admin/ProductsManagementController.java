package com.ecommerce.myapp.controller.Admin;

import com.ecommerce.myapp.dtos.product.ProductFullInfoDTO;
import com.ecommerce.myapp.dtos.product.mappers.ProductFullMapper;
import com.ecommerce.myapp.model.group.Product;
import com.ecommerce.myapp.s3.S3ProductImages;
import com.ecommerce.myapp.services.ProductService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/management/product")
@PreAuthorize("hasAnyRole('ADMIN','MANAGER')")
public class ProductsManagementController {
    private final ProductService productService;
    private final ProductFullMapper productFullMapper;

    @Cacheable(value = "product-table", key = "{#page,#sortField,#sortDir,#query}",
            condition = "#query.length() > 3")
    @GetMapping("/product-table")
    public ResponseEntity<Map<String, Object>> getProductById(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "20") int size,
            @RequestParam(name = "q", defaultValue = "") String query,
            @RequestParam(name = "sortField", defaultValue = "productName") String sortField,
            @RequestParam(name = "sortDir", defaultValue = "asc") String sortDir) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDir.equals("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortField));
        Page<Product> products = productService.productPageWithSearch(query, pageable);
        Page<ProductFullInfoDTO> productPage = products.map(productFullMapper::toDto);
        Map<String, Object> response = new HashMap<>();
        response.put("content", productPage.getContent());
        response.put("totalPages", productPage.getTotalPages());
        return ResponseEntity.ok(response);
    }

    @CacheEvict(value = {"productSearch", "all-product",
            "featured-Products", "new-products",
            "best-seller-products", "product","product-by-category"}, allEntries = true)
    @PostMapping(value = "/create")
    public ResponseEntity<Void> createProduct(@Valid @ModelAttribute ProductFullInfoDTO createProduct) {
        productService.addNewProduct(createProduct);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Cacheable(value = "product", key = "#productId")
    @GetMapping(value = "/get/{productId}")
    public ResponseEntity<ProductFullInfoDTO> getProduct(@PathVariable("productId") Long productId) {
        ProductFullInfoDTO response = productFullMapper.toDto(productService.getProductById(productId));
        return ResponseEntity.ok(response);
    }

    @CacheEvict(value = {
            "productSearch", "all-product",
            "featured-Products", "new-products",
            "best-seller-products", "product","product-by-category"}, allEntries = true)
    @PutMapping(value = "/update")
    public ResponseEntity<Void> updateProduct(@Valid @ModelAttribute ProductFullInfoDTO updateData) {
        productService.updateProduct(updateData);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Cacheable(value = "product-images", key = "#productId")
    @GetMapping(value = "/get-images")
    public ResponseEntity<Set<S3ProductImages>> getImages(@RequestParam("productId") Long productId) {
        Set<S3ProductImages> imagesObjs = productService.getProductImages(productService.findById(productId));
        return ResponseEntity.ok(imagesObjs);
    }

    @CacheEvict(value = {
            "productSearch", "all-product",
            "featured-Products", "new-products",
            "best-seller-products", "product","product-by-category"}, allEntries = true)
    @DeleteMapping(value = "/delete/{productId}")
    @PreAuthorize("hasAuthority('admin:delete')")
    public ResponseEntity<Void> deleteProduct(@PathVariable("productId") Long productId) {
        productService.deleteById(productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
