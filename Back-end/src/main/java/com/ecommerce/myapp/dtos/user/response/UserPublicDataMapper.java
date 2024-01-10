package com.ecommerce.myapp.dtos.user.response;

import com.ecommerce.myapp.model.user.AppUser;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface  UserPublicDataMapper {
    AppUser toEntity(ResUserDetailData resUserDetailData);

    ResUserDetailData toDto(AppUser appUser);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    AppUser partialUpdate(ResUserDetailData resUserDetailData, @MappingTarget AppUser appUser);
}