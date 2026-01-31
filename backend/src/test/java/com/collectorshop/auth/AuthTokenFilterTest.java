package com.collectorshop.auth;

import com.collectorshop.shared.model.UserRole;
import com.collectorshop.user.UserAccount;
import com.collectorshop.user.UserToken;
import com.collectorshop.user.UserTokenRepository;
import com.collectorshop.user.UserTokenType;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockFilterChain;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.lang.reflect.Field;
import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthTokenFilterTest {

    @Mock
    private UserTokenRepository userTokenRepository;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void filterSetsAuthenticationForActiveSession() throws Exception {
        UserAccount user = new UserAccount("user@example.com", "hash", "Jean", Set.of(UserRole.BUYER));
        setId(user, UUID.randomUUID());
        UserToken token = new UserToken(user, "session-token", UserTokenType.SESSION, Instant.now().plusSeconds(3600));
        when(userTokenRepository.findByTokenAndType("session-token", UserTokenType.SESSION))
                .thenReturn(Optional.of(token));

        AuthTokenFilter filter = new AuthTokenFilter(userTokenRepository);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer session-token");
        MockHttpServletResponse response = new MockHttpServletResponse();

        filter.doFilter(request, response, new MockFilterChain());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(authentication);
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        assertEquals(user.getId(), principal.id());
    }

    @Test
    void filterSkipsWhenMissingHeader() throws Exception {
        AuthTokenFilter filter = new AuthTokenFilter(userTokenRepository);

        filter.doFilter(new MockHttpServletRequest(), new MockHttpServletResponse(), new MockFilterChain());

        assertNull(SecurityContextHolder.getContext().getAuthentication());
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
