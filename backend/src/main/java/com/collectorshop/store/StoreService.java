package com.collectorshop.store;

import com.collectorshop.shared.model.UserRole;
import com.collectorshop.user.UserAccount;
import com.collectorshop.user.UserAccountRepository;
import com.collectorshop.user.UserStore;
import com.collectorshop.user.UserStoreRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class StoreService {

    private final UserAccountRepository userAccountRepository;
    private final UserStoreRepository userStoreRepository;

    public StoreService(UserAccountRepository userAccountRepository, UserStoreRepository userStoreRepository) {
        this.userAccountRepository = userAccountRepository;
        this.userStoreRepository = userStoreRepository;
    }

    public List<StoreSummary> listStores(UUID ownerId) {
        return userStoreRepository.findByOwnerIdOrderByCreatedAtDesc(ownerId).stream()
                .map(store -> new StoreSummary(store.getId(), store.getName(), store.getSlug(), store.getCreatedAt()))
                .toList();
    }

    public StoreSummary createStore(UUID ownerId, StoreCreateRequest request) {
        UserAccount user = userAccountRepository.findById(ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable"));

        if (!user.getRoles().contains(UserRole.SELLER)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous devez être vendeur pour créer une boutique");
        }

        String baseSlug = slugify(request.name());
        if (baseSlug.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nom de boutique invalide");
        }

        String slug = baseSlug;
        int suffix = 1;
        while (userStoreRepository.existsByOwnerIdAndSlug(ownerId, slug)) {
            slug = baseSlug + "-" + suffix++;
        }

        UserStore store = new UserStore(user, request.name().trim(), slug);
        userStoreRepository.save(store);

        return new StoreSummary(store.getId(), store.getName(), store.getSlug(), store.getCreatedAt());
    }

    private String slugify(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return normalized
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }
}
