package com.ecommerce.myapp.dtos.user;

import com.ecommerce.myapp.model.user.AppUser;
import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;

/**
 * DTO for {@link AppUser}
 */
public record AppUserDto(
        @NotNull(message = "User ID cannot be null")
        @Positive(message = "User ID must be positive")
        Long userId,
        @NotBlank(message = "user name can't be blank")
        String userName,

        @Size(message = "maximum limit character for email is 255", max = 255)
        @Email(message = "Wrong email format")
        @NotBlank(message = "email cannot be blank")
        String email,

        @NotBlank(message = "user full name can't be blank")
        String fullName,

        @Size(message = "maximum limit character for password is 255", max = 255)
        @Pattern(message = "Password must have a capital letter and at least one special character",
                regexp = "^(?=.*[A-Z])(?=.*[@#$%^&+=!]).+$")
        @NotBlank(message = "password cannot be blank")
        String password,

        @Size(message = "maximum limit character for phone number is 15", max = 15)
        @Pattern(regexp = "^0[35789]\\d{8}$", message = "Invalid phone number")
        String phone,

        MultipartFile avatar


) implements Serializable {
}