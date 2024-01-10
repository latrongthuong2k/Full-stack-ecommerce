package com.ecommerce.myapp.security.ReqResSecurity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChangeEmailPasswordReq {
    @Size(message = "maximum limit character for email is 50", max = 50)
    @Email(message = "Wrong email format")
    @NotBlank(message = "Username cannot be blank")
    String newEmail;
    ChangePasswordRequest changePasswordRequest;
}
