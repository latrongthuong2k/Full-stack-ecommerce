package com.ecommerce.myapp.services.impl;

import com.ecommerce.myapp.dtos.cart.Address.UserAddressDto;
import com.ecommerce.myapp.dtos.cart.Address.UserAddressMapper;
import com.ecommerce.myapp.dtos.user.mapper.UserPageMapper;
import com.ecommerce.myapp.dtos.user.request.UserChangeInfoReq;
import com.ecommerce.myapp.dtos.user.response.ResListUsers;
import com.ecommerce.myapp.dtos.user.response.ResUserDetailData;
import com.ecommerce.myapp.exceptions.ResourceNotFoundException;
import com.ecommerce.myapp.model.client.UserAddress;
import com.ecommerce.myapp.model.user.AppUser;
import com.ecommerce.myapp.model.user.Role;
import com.ecommerce.myapp.model.user.UserImage;
import com.ecommerce.myapp.repositories.AppUserRepository;
import com.ecommerce.myapp.repositories.UserAddressRepository;
import com.ecommerce.myapp.repositories.UserImageRepository;
import com.ecommerce.myapp.s3.S3Buckets;
import com.ecommerce.myapp.s3.S3ProductImages;
import com.ecommerce.myapp.s3.S3Service;
import com.ecommerce.myapp.security.ReqResSecurity.ChangePasswordRequest;
import com.ecommerce.myapp.security.Token.TokenRepository;
import com.ecommerce.myapp.services.UserService;
import com.ecommerce.myapp.services.app.AppAuditAwareService;
import com.ecommerce.myapp.validator.EntityExistenceValidatorService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;
import java.util.UUID;


@Service
@Transactional
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserPageMapper userPageMapper;
    private final UserAddressMapper userAddressMapper;

    private final EntityExistenceValidatorService validatorService;
    private final AppAuditAwareService auditAwareService;

    private final S3Service s3Service;
    private final S3Buckets s3Buckets;
    private final PasswordEncoder passwordEncoder;

    private final TokenRepository tokenRepository;
    private final AppUserRepository appUserRepository;
    private final UserImageRepository userImageRepository;
    private final UserAddressRepository userAddressRepository;


    // current auditor
    @Override
    public AppUser getCurrentAuditor() {
        Long currentUserId = auditAwareService.getCurrentAuditor().orElseThrow(
                () -> new ResourceNotFoundException("Can't get user ID"));
        return foundUser(currentUserId);
    }

    // Auth
    @Override
    public void userChangePassword(ChangePasswordRequest request, AppUser appUser) {
        validateChangePasswordReq(request, appUser);
    }

    public void adminChangePassword(ChangePasswordRequest request, AppUser user) {
        validateChangePasswordReq(request, user);
    }

    private void validateChangePasswordReq(ChangePasswordRequest request, AppUser user) {
        // check if the current password is correct
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Wrong password");
        }
        // check if the two new passwords are the same
        if (!request.getNewPassword().equals(request.getConfirmationPassword())) {
            throw new IllegalArgumentException("Password are not the same");
        }
        // update the password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        // save the new password
        appUserRepository.save(user);
    }

    @Override
    public void changeRole(Long userId, Role role) {
        var user = findById(userId);
        user.setRole(role);
        // save new user with new authorize
        appUserRepository.save(user);
    }
    @Override
    public void deleteAdminManagerRole(Long userId) {
        var user = findById(userId);
        user.setRole(Role.USER);
        // save new user with new authorize
        appUserRepository.save(user);
    }


    @Override
    public ResUserDetailData getUserPrevDataById(Long id) {
        AppUser appUser = foundUser(id);
        return new ResUserDetailData(
                id,
                appUser.getUsername(),
                appUser.getEmail(),
                appUser.getPassword(),
                appUser.getPhone());
    }

    // update by user account
    @Override
    public void updateAccountDetail(UserChangeInfoReq userChangeInfoReq) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof AppUser user) {
            user.setFullName(userChangeInfoReq.fullName());
            user.setPhone(userChangeInfoReq.phone());
            if (!userChangeInfoReq.avatarFile().isEmpty()) {
//                deleteS3Object(user);
                userImageRepository.deleteByAppUser(user);
                uploadUserProfileImage(user, userChangeInfoReq.avatarFile().getFirst());
            }
//            userChangePassword(userChangeInfoReq.changeEmailPassWordReq().getChangePasswordRequest(), user);
            appUserRepository.save(user);
        }
    }


    // chỉ có Admin role mới xoá được
    @Override
    public void deleteById(Long userId) {
        validatorService.checkExistUser(userId);
        // clean token
        tokenRepository.deleteByUserId(userId);
        appUserRepository.deleteById(userId);
    }

    @Override
    public AppUser findById(Long userId) {
        if (userId == null) {
            return null;
        }
        return foundUser(userId);
    }

    @Override
    public AppUser findByUserName(String userName) {
        return appUserRepository.findByUserNameOrEmail(userName).orElseThrow(() ->
                new ResourceNotFoundException("User with name [%s] is not found ".formatted(userName)));
    }

    @Override
    public boolean existsByEmail(String email, String userName) {
        return appUserRepository.existsByEmailOrUserName(email, userName);
    }

    @Override
    public void uploadUserProfileImage(AppUser user,
                                       MultipartFile file) {
        String key = UUID.randomUUID().toString();
        try {
            s3Service.putObject(
                    s3Buckets.getUserImageBucket(), // bucketName
                    "profile-images/%s/%s".formatted(user.getUserId(), key),
                    file.getBytes()
            );
        } catch (IOException e) {
            throw new RuntimeException("failed to upload profile image", e);
        }
        UserImage userImage = UserImage.builder()
                .appUser(user)
                .Key(key)
                .build();
        userImageRepository.save(userImage);
    }

    @Override
    public S3ProductImages getUserProfileImage(AppUser appUser) {
        UserImage userImage = userImageRepository.findByAppUser(appUser).orElseThrow(
                () -> new EntityNotFoundException("User with id [%s] profile image not found"
                        .formatted(appUser.getUserId())));
        return s3Service.getObjectUrl(
                s3Buckets.getUserImageBucket(),
                "profile-images/%s/%s".formatted(appUser.getUserId(), userImage.getKey())
        );
    }

    @Override
    public void deleteS3Object(AppUser appUser) {
//        UserImage userImage = userImageRepository.findByAppUser(appUser).orElseThrow(
//                () -> new EntityNotFoundException("User with id [%s] profile image not found"
//                        .formatted(appUser.getUserId())));

//        s3Service.deleteObject(s3Buckets.getUserImageBucket(), userImage.getKey());
    }

    @Override
    public Page<ResListUsers> getNonAdminUserAccounts(String query, Pageable pageable) {
        Page<AppUser> users = appUserRepository
                .getNonAdminUserAccounts(query, pageable);
        return users.map(userPageMapper::toDto);
    }

    @Override
    public Page<ResListUsers> getUserAccounts(String query, Pageable pageable) {
        Page<AppUser> users = appUserRepository
                .getUserAccounts(query, Role.USER, pageable);
        return users.map(userPageMapper::toDto);
    }

    @Override
    public void updateStatus(Long userId) {
        AppUser appUser = foundUser(userId);
        boolean currentStatus = appUser.getStatus();
        appUser.setStatus(!currentStatus);
    }

    @Override
    public void addAddress(UserAddressDto userAddressDto) {
        UserAddress userAddress = userAddressMapper.toEntity(userAddressDto);
        var user = getCurrentAuditor();
        if (userAddress.getIsMainAddress()) {
            Set<UserAddress> userAddresses = userAddressRepository.findAllByUserId(user.getUserId());
            userAddresses.forEach(address -> address.setIsMainAddress(false));
        }
        userAddress.setAppUser(user);
        userAddressRepository.save(userAddress);
    }

    @Override
    public void changeMainAddress(UserAddressDto userAddressDto) {
        if (userAddressDto.id() == null)
            throw new IllegalArgumentException("Address ID cannot be null");
        UserAddress userAddress = userAddressMapper.toEntity(userAddressDto);
        var user = getCurrentAuditor();
        if (userAddress.getIsMainAddress()) {
            Set<UserAddress> userAddresses = userAddressRepository.findAllByUserId(user.getUserId());
            userAddresses.forEach(address -> address.setIsMainAddress(false));
        }
        userAddressRepository.save(userAddress);
    }

    public Set<UserAddress> getUserAddresses(AppUser appUser) {
        return userAddressRepository.findAllByUserId(appUser.getUserId());
    }

    @Override
    public UserAddress getAddressByAddressID(Long addressId) {
        return userAddressRepository.findById(addressId).orElseThrow(
                () -> new ResourceNotFoundException(STR."Address with ID \{addressId} can't found"));
    }

    //-------------
    private AppUser foundUser(Long userId) {
        return appUserRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User with id [%s] is not found ".formatted(userId)));
    }


}