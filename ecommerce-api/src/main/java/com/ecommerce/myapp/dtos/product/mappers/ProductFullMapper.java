package com.ecommerce.myapp.dtos.product.mappers;

import com.ecommerce.myapp.dtos.product.ProductFullInfoDTO;
import com.ecommerce.myapp.dtos.product.response.ResProductDetailDTO;
import com.ecommerce.myapp.model.group.Product;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface ProductFullMapper {
    Product toEntity(ProductFullInfoDTO reqCreateProductDTO);
    ProductFullInfoDTO toDto(Product product);
    ResProductDetailDTO toProductDto(Product product);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Product partialUpdate(ProductFullInfoDTO productFullInfoDTO, @MappingTarget Product product);
}