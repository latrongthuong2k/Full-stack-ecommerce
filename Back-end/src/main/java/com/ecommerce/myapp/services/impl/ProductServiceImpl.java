package com.ecommerce.myapp.services.impl;

import com.ecommerce.myapp.dtos.product.ProductFullInfoDTO;
import com.ecommerce.myapp.dtos.product.mappers.ProductFullMapper;
import com.ecommerce.myapp.dtos.product.response.ProductPriorityDTO;
import com.ecommerce.myapp.exceptions.ResourceNotFoundException;
import com.ecommerce.myapp.model.group.Category;
import com.ecommerce.myapp.model.group.Product;
import com.ecommerce.myapp.model.group.ProductImage;
import com.ecommerce.myapp.model.group.Size;
import com.ecommerce.myapp.repositories.ProductImageRepository;
import com.ecommerce.myapp.repositories.ProductRepository;
import com.ecommerce.myapp.repositories.SizeRepository;
import com.ecommerce.myapp.s3.S3Buckets;
import com.ecommerce.myapp.s3.S3ProductImages;
import com.ecommerce.myapp.s3.S3ProductImagesDetail;
import com.ecommerce.myapp.s3.S3Service;
import com.ecommerce.myapp.services.CategoryService;
import com.ecommerce.myapp.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;
    private final ProductRepository productRepository;
    private final ProductFullMapper productFullMapper;

    private final CategoryService categoryService;
    private final ProductImageRepository productImageRepository;
    private final SizeRepository sizeRepository;

    // Services

    @Override
    public void addNewProduct(ProductFullInfoDTO productDto) {
        Product productNew = new Product();
        Category category = categoryService.getCategory(productDto.categoryId());
        Product product = productFullMapper.partialUpdate(productDto, productNew);
        product.setCategory(category);
        List<String> sizeIds = Arrays.stream(productDto.stringSizes().split(",")).toList();
        if (!sizeIds.isEmpty()) {
            Set<Long> longSizeIds = sizeIds.stream()
                    .map(Long::parseLong)
                    .collect(Collectors.toSet());
            List<Size> sizes = sizeRepository.findAllById(longSizeIds);
            product.setSizes(new ArrayList<>(sizes));
        }
        Product savedProduct = productRepository.save(product);
        addImages(savedProduct, productDto.imageFiles());
    }

    @Override
    public List<Product> findAllByIds(List<Long> ids) {
        return productRepository.findAllById(ids);
    }

    @Override
    public Product findById(Long productId) {
        return foundProduct(productId);
    }

    @Override
    public Product foundProductByName(String productName) {
        return productRepository.findByProductName(productName).orElseThrow(() -> new ResourceNotFoundException(
                "user with id [%s] not found".formatted(productName)
        ));
    }

    @Override
    public Product getProductById(Long productId) {
        return productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException(
                "Product with ID [%s] not found".formatted(productId)
        ));
    }

    // permitAll

    // search
    @Override
    public List<Product> productsWithSearch(String query) {
        return productRepository.searchAllByProductNameAndDescription(query);
    }

    @Override
    public Page<Product> productPageWithSearch(String query, Pageable pageable) {
        return productRepository.getPageProduct(query, pageable);
    }

    //    @Override
//    public Page<Product> productPageWithSearch(String query, Pageable pageable) {
//        Page<Product> productIds = productRepository.getPageProduct(query, pageable);
//        return productIds.map(productIds -> getProductDetails(productIds.getId()));
//    }
    @Cacheable(value = "product-details", key = "#productId")
    public Product getProductDetails(Long productId) {
        return productRepository.findById(productId).orElse(null);
    }

    // Selling Products
    @Override
    public Page<Product> getAllProduct(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Page<Product> getAllProductByFilter(Long categoryId, BigDecimal price, Set<Long> sizeIDs, Pageable pageable) {
        Page<Product> products;
        if (sizeIDs == null || sizeIDs.isEmpty()) {
            products = productRepository.findAllByFilterExcludingSize(categoryId, price, pageable);
        } else {
            products = productRepository.findAllByFilter(categoryId, price, sizeIDs, pageable);
        }
        return products;
    }


    // featured-productIds
    @Override
    public Page<ProductPriorityDTO> getFeaturedProducts(Pageable pageable) {
        return productRepository.featuredProducts(pageable);
    }

    @Override
    public Page<Product> getNewProducts(Pageable pageable) {
        LocalDate weekAgo = LocalDate.now().minusWeeks(1);
        return productRepository.newProducts(weekAgo.atStartOfDay(), pageable);
    }

    @Override
    public Page<Product> getBestSellerProducts(Pageable pageable) {
        return productRepository.bestSellerProducts(pageable);
    }

    @Override
    public List<Size> getAllSize() {
        return sizeRepository.findAll();
    }

    @Override
    public void deleteById(Long productId) {
//        var product = productRepository.findById(productId);
//        if (product.isPresent()) {
//            deleteS3Image(product.get(), s3Buckets.getProduct());
//            if (product.get().getStatus()) {
//                throw new CannotDeleteException("Active product can not be delete");
//            }
//            productRepository.deleteById(productId);
//        } else
//            throw new ResourceNotFoundException(STR."Can't delete product with ID \{productId} because it doesn't exist");
        var product = productRepository.findById(productId);
        if (product.isPresent()) {
            var productFound = product.get();
            productFound.setStatus(false);
            productRepository.save(productFound);
        } else
            throw new ResourceNotFoundException(STR."Can't delete product with ID \{productId} because it doesn't exist");

    }


    // Thêm ảnh của sản phẩm
    @Override
    public void addImages(Product product, List<MultipartFile> files) {
        List<ProductImage> productImages = new ArrayList<>();
        for (MultipartFile file : files) {
            String key = UUID.randomUUID().toString();
            try {
                String imageCode = "productIds-images/%s/%s".formatted(product.getProductId(), key);
                s3Service.putObject(
                        s3Buckets.getProduct(),
                        imageCode,
                        file.getBytes()
                );
                ProductImage productImage = ProductImage.builder().Key(imageCode).product(product).build();
                productImages.add(productImage);
            } catch (IOException e) {
                throw new RuntimeException(String.format("failed to upload productIds image with id %s", key), e);
            }
        }
        productImages.getFirst().setPrimary(true);
        productImageRepository.saveAll(productImages);
    }

    public void deleteS3Image(Product product, String bucketName) {
        Set<ProductImage> productImages = productImageRepository.findByProduct(product);
        if (productImages.isEmpty()) {
            throw new ResourceNotFoundException("Image not found");
        }
        for (ProductImage productImage : productImages) {
            String imageCode = "category-images/%s/%s".formatted(product.getProductId(), productImage.getKey());
            s3Service.deleteObject(
                    bucketName,
                    imageCode
            );
        }

    }

    @Override
    public Set<S3ProductImages> getProductImages(Product product) {
        Set<ProductImage> productImages = productImageRepository.findByProduct(product);
        if (productImages.isEmpty()) {
            throw new ResourceNotFoundException(STR."Product with Id \{product} don't have any images");
        }
        List<String> s3Keys = productImages.stream()
                .map(ProductImage::getKey).toList();
        return s3Service.getObjects(s3Buckets.getProduct(), s3Keys);
    }

    @Override
    public Set<S3ProductImagesDetail> findImages(Product product) {
        Set<ProductImage> productImages = productImageRepository.findByProduct(product);
        if (productImages.isEmpty()) {
            return Collections.emptySet();
        }
        List<String> s3Keys = productImages.stream()
                .map(ProductImage::getKey).toList();
        Map<String, Boolean> keyIsPrimaryMap = productImages.stream()
                .collect(Collectors.toMap(ProductImage::getKey, ProductImage::isPrimary));

        Set<S3ProductImages> imagesData = s3Service.getObjects(s3Buckets.getProduct(), s3Keys);
        return imagesData.stream().map(img ->
                        new S3ProductImagesDetail(img.key(), img.url(), keyIsPrimaryMap.getOrDefault(img.key(), false)))
                .collect(Collectors.toSet());
    }

    @Override
    public Set<S3ProductImages> getMainImage(Long product) {
        Optional<ProductImage> productImage = productImageRepository.findMainImage(product);
        List<String> s3Keys = new ArrayList<>();
        productImage.ifPresent(image -> s3Keys.add(image.getKey()));
        return s3Service.getObjects(s3Buckets.getProduct(), s3Keys);
    }

    @Override
    public void deleteS3Image(String imageKey) {
        s3Service.deleteObject(s3Buckets.getProduct(), imageKey);
    }

    @Override
    public void updateProduct(ProductFullInfoDTO updateData) {
        Product product = foundProduct(updateData.productId());
        Product updatedProduct = productFullMapper.partialUpdate(updateData, product);
        List<String> sizeIds = Arrays.stream(updateData.stringSizes().split(",")).toList();
        if (!sizeIds.isEmpty()) {
            Set<Long> longSizeIds = sizeIds.stream()
                    .map(Long::parseLong)
                    .collect(Collectors.toSet());
            List<Size> sizes = sizeRepository.findAllById(longSizeIds);
            sizeRepository.deleteAllByProductId(product.getProductId());
            updatedProduct.setSizes(new ArrayList<>(sizes));
            if (!updateData.imageFiles().isEmpty()) {
                // Add new images logic
                addImages(product, updateData.imageFiles());
            }
            productRepository.save(updatedProduct);
        }
    }

    @Override
    public List<Size> getSizeByProductId(Long prodId) {
        return sizeRepository.findAllByProdId(prodId);
    }

    private Product foundProduct(Long productId) {
        return productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException(
                "productIds id [%s] is not found".formatted(productId)
        ));
    }
}
