package com.collectorshop.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserTokenRepository extends JpaRepository<UserToken, UUID> {
    Optional<UserToken> findByTokenAndType(String token, UserTokenType type);

    List<UserToken> findByUserIdAndTypeAndConsumedAtIsNull(UUID userId, UserTokenType type);
}
