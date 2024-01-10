package com.ecommerce.myapp.dtos.user.mapper;

import com.ecommerce.myapp.dtos.cart.Address.UserAddressMapper;
import com.ecommerce.myapp.dtos.user.AppUserFullInfo;
import com.ecommerce.myapp.model.user.AppUser;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING, uses = {UserAddressMapper.class})
public interface AppUserFullInfoMapper {
    AppUser toEntity(AppUserFullInfo appUserFullInfo);

    @AfterMapping
    default void linkUserAddresses(@MappingTarget AppUser appUser) {
        appUser.getUserAddresses().forEach(userAddress -> userAddress.setAppUser(appUser));
    }

    AppUserFullInfo toDto(AppUser appUser);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    AppUser partialUpdate(AppUserFullInfo appUserFullInfo, @MappingTarget AppUser appUser);
}