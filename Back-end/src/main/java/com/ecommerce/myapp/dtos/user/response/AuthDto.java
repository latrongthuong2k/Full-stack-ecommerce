package com.ecommerce.myapp.dtos.user.response;


import com.ecommerce.myapp.model.user.Role;

import java.io.Serializable;

public record AuthDto(
        Long userId,
        Role role
) implements Serializable {
}
