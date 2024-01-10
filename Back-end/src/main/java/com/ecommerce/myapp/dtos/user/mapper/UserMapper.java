package com.ecommerce.myapp.dtos.user.mapper;


import com.ecommerce.myapp.dtos.user.AppUserDto;
import com.ecommerce.myapp.model.user.AppUser;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMapper {

    AppUser toEntity(AppUserDto appUserDto);

    AppUserDto toDto(AppUser appUser);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    AppUser partialUpdate(AppUserDto appUserDto, @MappingTarget AppUser appUser);
}