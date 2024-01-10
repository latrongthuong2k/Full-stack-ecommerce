package com.ecommerce.myapp.security.ReqResSecurity;

import com.ecommerce.myapp.model.user.Gender;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @Size(message = "Maximum limit character for password is 100 and at least 6 characters", min = 6, max = 100)
    @NotBlank(message = "user name can't be blank")
    private String userName;

    @Size(message = "Maximum limit character for email is 255", max = 255)
    @Email(message = "Wrong email format")
    @NotBlank(message = "Email cannot be blank")
    private String email;

    @NotBlank(message = "user full name can't be blank")
    private String fullName;

    @Size(message = "Maximum limit character for password is 255", max = 255)
    @Pattern(message = "Password must have a capital letter and at least one special character",
            regexp = "^(?=.*[A-Z])(?=.*[@#$%^&+=!]).+$")
    @NotBlank(message = "password cannot be blank")
    private String password;

    //    @Size(message = "Maximum limit character for phone number is 15", max = 15)
//    @Pattern(regexp = "^0[35789]\\d{8}$", message = "Invalid phone number")
    @NotNull
    private Gender gender;

//    private Role role;
    private String prevPath;
}