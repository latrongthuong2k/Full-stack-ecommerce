package com.ecommerce.myapp.security.ReqResSecurity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChangePasswordRequest {

    private String currentPassword;
    @Size(message = "maximum limit character for password is 255", max = 255)
    @Pattern(message = "Password must have a capital letter and at least one special character",
            regexp = "^(?=.*[A-Z])(?=.*[@#$%^&+=!]).+$")
    @NotBlank(message = "password cannot be blank")
    private String newPassword;
    private String confirmationPassword;
}