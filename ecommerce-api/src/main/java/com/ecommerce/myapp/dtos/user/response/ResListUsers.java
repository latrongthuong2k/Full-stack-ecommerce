package com.ecommerce.myapp.dtos.user.response;


import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_DEFAULT)
public record ResListUsers(
        Long userId,
        String firstName,
        String lastName,
        String fullName,
        String email,
        LocalDateTime createdAt,
        LocalDateTime updateAt,
        Boolean status,
        String role
) {
}
