package com.collectorshop.chat;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class MessageSanitizerTest {

    private final MessageSanitizer sanitizer = new MessageSanitizer();

    @Test
    void sanitizePreviewReturnsEmptyStringForNull() {
        assertEquals("", sanitizer.sanitizePreview(null));
    }

    @Test
    void sanitizePreviewMasksPersonalInfo() {
        assertEquals("[contenu modéré]", sanitizer.sanitizePreview("Appelez-moi au 0612345678"));
        assertEquals("[contenu modéré]", sanitizer.sanitizePreview("Contactez-moi @email"));
    }

    @Test
    void sanitizePreviewKeepsSafeText() {
        assertEquals("Bonjour", sanitizer.sanitizePreview("Bonjour"));
    }
}
