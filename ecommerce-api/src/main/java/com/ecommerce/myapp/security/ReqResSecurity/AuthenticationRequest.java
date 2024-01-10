package com.ecommerce.myapp.security.ReqResSecurity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {

    @Size(message = "Username must be at least 6 characters and maximum 100 character", min = 6, max = 255)
    @NotBlank(message = "Email can't be blank")
    private String email;

    @Size(message = "maximum limit character for password is 255", max = 255)
    @Pattern(message = "Password must have a capital letter and at least one special character",
            regexp = "^(?=.*[A-Z])(?=.*[@#$%^&+=!]).+$")
    @NotBlank(message = "password cannot be blank")
    private String password;

    private String prevPath;
}