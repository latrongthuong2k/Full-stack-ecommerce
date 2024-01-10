package com.ecommerce.myapp.repositories;

import com.ecommerce.myapp.model.user.AppUser;
import com.ecommerce.myapp.model.user.UserImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserImageRepository extends JpaRepository<UserImage, Long> {
    Optional<UserImage> findByAppUser(AppUser appUser);

    void deleteByAppUser(AppUser appUser);
}