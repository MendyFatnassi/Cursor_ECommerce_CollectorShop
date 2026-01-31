package com.collectorshop.user;

import com.collectorshop.shared.model.UserRole;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class UserStoreTest {

    @Test
    void userStoreExposesFields() {
        UserAccount owner = new UserAccount("owner@example.com", "hash", "Owner", Set.of(UserRole.SELLER));
        UserStore store = new UserStore(owner, "Boutique", "boutique");

        store.onCreate();

        assertEquals("Boutique", store.getName());
        assertEquals("boutique", store.getSlug());
        assertEquals(owner, store.getOwner());
        assertNotNull(store.getCreatedAt());
    }
}
