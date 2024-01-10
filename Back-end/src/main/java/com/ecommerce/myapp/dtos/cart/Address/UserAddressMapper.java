package com.ecommerce.myapp.dtos.cart.Address;

import com.ecommerce.myapp.model.client.UserAddress;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserAddressMapper {
    UserAddress toEntity(UserAddressDto userAddressDto);

    UserAddressDto toDto(UserAddress userAddress);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    UserAddress partialUpdate(UserAddressDto userAddressDto, @MappingTarget UserAddress userAddress);

    UserAddress toEntity(com.ecommerce.myapp.model.user.UserAddressDto userAddressDto);

    com.ecommerce.myapp.model.user.UserAddressDto toDto1(UserAddress userAddress);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    UserAddress partialUpdate(com.ecommerce.myapp.model.user.UserAddressDto userAddressDto, @MappingTarget UserAddress userAddress);
}