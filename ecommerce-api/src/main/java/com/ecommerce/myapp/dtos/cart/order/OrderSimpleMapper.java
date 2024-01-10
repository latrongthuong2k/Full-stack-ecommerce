package com.ecommerce.myapp.dtos.cart.order;

import com.ecommerce.myapp.dtos.cart.order.response.OrderSimpleInfoDto;
import com.ecommerce.myapp.model.checkoutGroup.Order;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface OrderSimpleMapper {
    Order toEntity(OrderSimpleInfoDto orderSimpleInfoDto);

    OrderSimpleInfoDto toDto(Order order);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Order partialUpdate(OrderSimpleInfoDto orderSimpleInfoDto, @MappingTarget Order order);
}