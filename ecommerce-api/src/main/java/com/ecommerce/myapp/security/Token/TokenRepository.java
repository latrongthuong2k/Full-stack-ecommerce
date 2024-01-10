package com.ecommerce.myapp.security.Token;

import com.ecommerce.myapp.model.user.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Integer> {


    @Query(value = """
            select t from Token t inner join AppUser u\s
            on t.user.userId = u.userId\s
            where u.userId = ?1 and (t.expired = false or t.revoked = false)\s
            """)
    List<Token> findAllValidTokenByUser(Long id);


    @Query(value = """
            select count(*) from Token t
            where t.expired = false or t.revoked = false\s
            """)
    int findAllInValidToken();

    Optional<Token> findByToken(String token);

    @Query(" select count(*) > 1 from Token t where t.token = ?1 and (t.expired = false or t.revoked = false ) ")
    boolean isValidToken (String token);

    @Modifying
    @Query(value = """
            DELETE FROM Token t WHERE  (t.expired = true or t.revoked = true )
            """)
    void deleteExpiredTokens();

    @Modifying
    @Query("delete from Token tk where tk.user.userId = ?1")
    void deleteByUserId(Long userId);

    Token findByUser(AppUser appUser);
}