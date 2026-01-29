package com.collectorshop.auth;

import com.collectorshop.user.UserToken;
import com.collectorshop.user.UserTokenRepository;
import com.collectorshop.user.UserTokenType;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Optional;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private final UserTokenRepository userTokenRepository;

    public AuthTokenFilter(UserTokenRepository userTokenRepository) {
        this.userTokenRepository = userTokenRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String tokenValue = header.substring(7);
            Optional<UserToken> sessionToken = userTokenRepository.findByTokenAndType(tokenValue, UserTokenType.SESSION);
            if (sessionToken.isPresent() && sessionToken.get().isActive(Instant.now())) {
                UserToken token = sessionToken.get();
                UserPrincipal principal = new UserPrincipal(
                        token.getUser().getId(),
                        token.getUser().getEmail(),
                        token.getUser().getRoles()
                );
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        principal.authorities()
                );
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
