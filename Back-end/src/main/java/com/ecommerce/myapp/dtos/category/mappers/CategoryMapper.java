package com.ecommerce.myapp.dtos.category.mappers;

import com.ecommerce.myapp.dtos.category.request.ReqCreateCategory;
import com.ecommerce.myapp.dtos.category.response.ResCategory;
import com.ecommerce.myapp.model.group.Category;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface CategoryMapper {
    Category toEntity(ReqCreateCategory reqCreateCategory);

    ResCategory toDto(Category category);

//    @AfterMapping
//    default S3ObjectCustom mapS3Object(Category category, @MappingTarget ResCategory resCategory) {
//        category.getCategoryImage();
//    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Category partialUpdate(ReqCreateCategory reqCreateCategory, @MappingTarget Category category);

    Category toEntity(ResCategory reqPageCategory);
}