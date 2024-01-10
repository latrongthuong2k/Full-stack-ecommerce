package com.ecommerce.myapp.dtos.user.mapper;

import com.ecommerce.myapp.dtos.product.mappers.ProductSimpleMapper;
import com.ecommerce.myapp.model.client.ProductWish;
import com.ecommerce.myapp.model.client.WishListDto;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE,
        componentModel = MappingConstants.ComponentModel.SPRING,
        uses = {ProductSimpleMapper.class})
public interface WishListMapper {
    ProductWish toEntity(WishListDto wishListDto);

    WishListDto toDto(ProductWish productWish);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    ProductWish partialUpdate(WishListDto wishListDto, @MappingTarget ProductWish productWish);
}