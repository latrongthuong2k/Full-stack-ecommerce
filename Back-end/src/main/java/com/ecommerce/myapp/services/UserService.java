package com.ecommerce.myapp.services;

import com.ecommerce.myapp.dtos.cart.Address.UserAddressDto;
import com.ecommerce.myapp.dtos.user.request.UserChangeInfoReq;
import com.ecommerce.myapp.dtos.user.response.ResListUsers;
import com.ecommerce.myapp.dtos.user.response.ResUserDetailData;
import com.ecommerce.myapp.model.client.UserAddress;
import com.ecommerce.myapp.model.user.AppUser;
import com.ecommerce.myapp.model.user.Role;
import com.ecommerce.myapp.s3.S3ProductImages;
import com.ecommerce.myapp.security.ReqResSecurity.ChangePasswordRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

public interface UserService {
    // current auditor
    AppUser getCurrentAuditor();

    // Auth
    void userChangePassword(ChangePasswordRequest request, AppUser appUser);

    // Todo: gọi hàm này trong menu Worker management -> acc đã thay đổi role thì sẽ bắt đăng nhập lại để có token mới
    void changeRole(Long userId, Role role);

    void deleteAdminManagerRole(Long userId);

    ResUserDetailData getUserPrevDataById(Long id);

    AppUser findById(Long userId);
    AppUser findByUserName(String userName);

    boolean existsByEmail(String email, String userName);

    void uploadUserProfileImage(AppUser userId,
                                MultipartFile file);

    S3ProductImages getUserProfileImage(AppUser user);

    void deleteS3Object(AppUser user);

    Page<ResListUsers> getNonAdminUserAccounts(String query, Pageable pageable);

    Page<ResListUsers> getUserAccounts(String query, Pageable pageable);

    void updateStatus(Long userId);

    void updateAccountDetail(UserChangeInfoReq userChangeInfoReq);

    void deleteById(Long id);

    void addAddress(UserAddressDto userAddressDto);

    void changeMainAddress(UserAddressDto userAddressDto);

    Set<UserAddress> getUserAddresses(AppUser appUser);

    UserAddress getAddressByAddressID(Long addressId);

}
