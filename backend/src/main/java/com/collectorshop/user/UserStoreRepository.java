package com.collectorshop.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserStoreRepository extends JpaRepository<UserStore, UUID> {
    List<UserStore> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId);

    boolean existsByOwnerIdAndSlug(UUID ownerId, String slug);
}
