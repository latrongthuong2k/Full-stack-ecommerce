package com.ecommerce.myapp.dtos.product.mappers;

import com.ecommerce.myapp.dtos.product.response.ResSimpleInfoProductDto;
import com.ecommerce.myapp.model.group.Product;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface ProductSimpleMapper {
    Product toEntity(ResSimpleInfoProductDto resSimpleInfoProductDto);


    @AfterMapping
    default void linkProductImages(@MappingTarget Product product) {
        product.getProductImages().forEach(productImage -> productImage.setProduct(product));
    }

    ResSimpleInfoProductDto toDto(Product product);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Product partialUpdate(ResSimpleInfoProductDto resSimpleInfoProductDto, @MappingTarget Product product);
}