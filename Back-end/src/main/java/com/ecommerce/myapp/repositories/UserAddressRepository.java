package com.ecommerce.myapp.repositories;

import com.ecommerce.myapp.model.client.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Long> {
    @Query("select u.userAddresses from AppUser u where u.userId = ?1")
    Set<UserAddress> findAllByUserId(Long userId);
}