package com.ecommerce.myapp.security.ReqResSecurity;

import com.ecommerce.myapp.model.user.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangeRoleRequest {
    @NotNull
    private Role role;
}
