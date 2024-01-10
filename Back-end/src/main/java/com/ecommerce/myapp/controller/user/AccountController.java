package com.ecommerce.myapp.controller.user;

import com.ecommerce.myapp.dtos.cart.Address.UserAddressDto;
import com.ecommerce.myapp.dtos.cart.Address.UserAddressMapper;
import com.ecommerce.myapp.dtos.cart.order.OrderMapper;
import com.ecommerce.myapp.dtos.cart.order.response.OrderDto;
import com.ecommerce.myapp.dtos.user.AppUserFullInfo;
import com.ecommerce.myapp.dtos.user.request.UserChangeInfoReq;
import com.ecommerce.myapp.model.checkoutGroup.OrderStatusV2;
import com.ecommerce.myapp.model.client.UserAddress;
import com.ecommerce.myapp.s3.S3ProductImages;
import com.ecommerce.myapp.security.ReqResSecurity.ChangePasswordRequest;
import com.ecommerce.myapp.services.OrderService;
import com.ecommerce.myapp.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/user/account")
@PreAuthorize("hasAnyRole('USER','ADMIN','MANAGER')")
public class AccountController {
    private final UserService userService;
    private final UserAddressMapper userAddressMapper;
    private final OrderMapper orderMapper;
    private final OrderService orderService;
//    private final AppUserFullInfoMapper appUserFullInfoMapper;

    //  /account/{userId}
    @GetMapping("/user-detail")
    public ResponseEntity<AppUserFullInfo> userInfo(
    ) {
        var user = userService.getCurrentAuditor();
        S3ProductImages userImage = userService.getUserProfileImage(user);

        return ResponseEntity.ok(new AppUserFullInfo(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getGender(),
                userService.getUserProfileImage(user),
                userService.getUserAddresses(user).stream().map(userAddressMapper::toDto).toList()
        ));
    }

    //  /account/{userId}
    @PutMapping("/update/user-detail")
    public ResponseEntity<Void> updateUserInfo(
            @Valid @ModelAttribute UserChangeInfoReq userChangeInfoReq
    ) {
        try {
            userService.updateAccountDetail(userChangeInfoReq);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //  /account/{userId}/change-password
    @PutMapping("/update/change-password")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest changePasswordRequest
    ) {
        userService.userChangePassword(changePasswordRequest, userService.getCurrentAuditor());
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //  /account/{userId}/address
    @PostMapping("/add/user-address")
    public ResponseEntity<String> addAddress(
            @Valid @RequestBody UserAddressDto UserAddressDto
    ) {
        try {
            userService.addAddress(UserAddressDto);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //  /account/{userId}/address
    @GetMapping("/get/user-address")
    public ResponseEntity<List<UserAddressDto>> getAllAddress(
    ) {
        try {
            Set<UserAddress> userAddresses = userService.getUserAddresses(userService.getCurrentAuditor());
            List<UserAddressDto> response = userAddresses.stream().map(userAddressMapper::toDto).toList();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //  /account/{userId}/address/{addressId}
    @GetMapping("/get/user-address/{addressId}")
    public ResponseEntity<UserAddressDto> getAddress(
            @PathVariable("addressId") Long addressId
    ) {
        try {
            UserAddressDto response = userAddressMapper
                    .toDto(userService.getAddressByAddressID(addressId));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //  /account/{userId}/history
    @GetMapping("/get/order-history")
    public ResponseEntity<List<OrderDto>> getOderHistory(
    ) {
        var user = userService.getCurrentAuditor();
        List<OrderDto> response = orderService
                .getOrderHistoryByUser(user, null).stream().map(orderMapper::toDto).toList();
        return ResponseEntity.ok(response);
    }

    //  /account/{userId}/history/{orderStatus}
    @GetMapping("/get/order-history/{status}")
    public ResponseEntity<List<OrderDto>> getOderHistory(
            @PathVariable(value = "status") String status
    ) {
        OrderStatusV2 orderStatus = OrderStatusV2.fromString(status);
        var user = userService.getCurrentAuditor();
        List<OrderDto> response = orderService
                .getOrderHistoryByUser(user, orderStatus).stream().map(orderMapper::toDto).toList();
        return ResponseEntity.ok(response);
    }

    //  /account/{userId}/history/{orderId}/cancel
    @PutMapping("/get/order-history/{orderId}/cancel")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable(value = "orderId") Long orderId
    ) {
        var user = userService.getCurrentAuditor();
        orderService.cancelOrder(user, orderId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}






