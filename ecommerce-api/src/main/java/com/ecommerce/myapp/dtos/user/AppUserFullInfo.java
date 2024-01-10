package com.ecommerce.myapp.dtos.user;

import com.ecommerce.myapp.dtos.cart.Address.UserAddressDto;
import com.ecommerce.myapp.model.user.Gender;
import com.ecommerce.myapp.s3.S3ProductImages;
import jakarta.validation.constraints.*;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for {@link com.ecommerce.myapp.model.user.AppUser}
 */
public record AppUserFullInfo(
        @NotNull Long userId,
        @NotBlank String userName,
        @Email @NotBlank String email,
        @NotEmpty String fullName,
        @Size(message = "maximum limit character for phone number is 15", max = 15)
        @Pattern(regexp = "^0[35789]\\d{8}$", message = "Invalid phone number")
        @NotNull String phone,
        @NotNull Gender gender,

        S3ProductImages image,

        List<UserAddressDto> userAddresses) implements Serializable {
}