package com.ecommerce.myapp.repositories;

import com.ecommerce.myapp.model.user.AppUser;
import com.ecommerce.myapp.model.user.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    @Query("select a from AppUser a where a.userName = ?1 or a.email = ?1")
    Optional<AppUser> findByUserNameOrEmail(String userNameOrEmail);

//    @Query("select exists(1) from AppUser a where a.userName = ?1 or a.email = ?1")
//    boolean existsByEmailAndUserName(String userNameOrEmail);
    boolean existsByEmailOrUserName(String userName, String email);


    Optional<AppUser> findByEmail(String email);


    @Query("select a from AppUser a where a.role != 'ADMIN' and " +
           "(lower(a.email) like lower(concat('%', ?1, '%')) " +
           "or lower(a.fullName) like lower(concat('%', ?1, '%')) " +
           "or lower(a.userName) like lower(concat('%', ?1, '%')))")
    Page<AppUser> getNonAdminUserAccounts(String search, Pageable pageable);

    @Query("select a from AppUser a where a.role = ?2 and " +
           "(lower(a.email) like lower(concat('%', ?1, '%')) " +
           "or lower(a.fullName) like lower(concat('%', ?1, '%')) " +
           "or lower(a.userName) like lower(concat('%', ?1, '%')))")
    Page<AppUser> getUserAccounts(String query, Role role, Pageable pageable);
}