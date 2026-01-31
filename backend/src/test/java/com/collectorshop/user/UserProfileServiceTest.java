package com.collectorshop.user;

import com.collectorshop.shared.model.UserRole;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserProfileServiceTest {

    @Mock
    private UserAccountRepository userAccountRepository;

    @InjectMocks
    private UserProfileService userProfileService;

    @Test
    void updateProfileKeepsAdminRole() {
        UserAccount user = userWithRoles(Set.of(UserRole.ADMIN));
        when(userAccountRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userAccountRepository.save(user)).thenReturn(user);

        ProfileUpdateRequest request = new ProfileUpdateRequest("Nouveau Nom", Set.of(UserRole.BUYER), Set.of("en-GB"));
        UserProfileResponse response = userProfileService.updateProfile(user.getId(), request);

        assertTrue(response.roles().contains(UserRole.ADMIN));
        assertTrue(response.roles().contains(UserRole.BUYER));
        assertEquals("Nouveau Nom", response.fullName());
    }

    @Test
    void updateProfileRejectsInvalidRoles() {
        UserAccount user = userWithRoles(Set.of(UserRole.BUYER));
        when(userAccountRepository.findById(user.getId())).thenReturn(Optional.of(user));

        ProfileUpdateRequest request = new ProfileUpdateRequest(null, Set.of(UserRole.ADMIN), null);
        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> userProfileService.updateProfile(user.getId(), request));

        assertEquals(HttpStatus.BAD_REQUEST, ex.getStatusCode());
    }

    @Test
    void updateProfileTrimsLocales() {
        UserAccount user = userWithRoles(Set.of(UserRole.BUYER));
        when(userAccountRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userAccountRepository.save(user)).thenReturn(user);

        ProfileUpdateRequest request = new ProfileUpdateRequest(null, null, Set.of(" fr-FR ", " ", "en-GB"));
        UserProfileResponse response = userProfileService.updateProfile(user.getId(), request);

        assertTrue(response.preferredLocales().contains("fr-FR"));
        assertTrue(response.preferredLocales().contains("en-GB"));
    }

    @Test
    void addInterestAddsTag() {
        UserAccount user = userWithRoles(Set.of(UserRole.BUYER));
        when(userAccountRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userAccountRepository.save(user)).thenReturn(user);

        List<String> tags = userProfileService.addInterest(user.getId(), " retro ");

        assertTrue(tags.contains("retro"));
    }

    @Test
    void toProfileReturnsStableSnapshot() {
        UserAccount user = userWithRoles(Set.of(UserRole.SELLER));
        user.setLocales(Set.of("fr-FR"));
        user.getInterestTags().add("vinyl");

        UserProfileResponse response = userProfileService.toProfile(user);

        assertEquals(user.getId(), response.id());
        assertEquals("vinyl", response.interestTags().iterator().next());
        assertEquals("fr-FR", response.preferredLocales().get(0));
    }

    private static UserAccount userWithRoles(Set<UserRole> roles) {
        UserAccount user = new UserAccount("user@example.com", "hash", "Jean", roles);
        setId(user, UUID.randomUUID());
        return user;
    }

    private static void setId(UserAccount user, UUID id) {
        try {
            Field field = UserAccount.class.getDeclaredField("id");
            field.setAccessible(true);
            field.set(user, id);
        } catch (ReflectiveOperationException ex) {
            throw new IllegalStateException("Impossible de définir l'identifiant pour le test", ex);
        }
    }
}
