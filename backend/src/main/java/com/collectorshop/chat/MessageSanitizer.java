package com.collectorshop.chat;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class MessageSanitizer {

    private static final Pattern PERSONAL_INFO_PATTERN = Pattern.compile("(\\d{10,}|@)", Pattern.CASE_INSENSITIVE);

    public String sanitizePreview(String preview) {
        if (preview == null) {
            return "";
        }
        return PERSONAL_INFO_PATTERN.matcher(preview).find() ? "[contenu modéré]" : preview;
    }
}




