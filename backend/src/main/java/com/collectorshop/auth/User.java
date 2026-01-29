package com.collectorshop.auth;

import com.collectorshop.shared.model.UserRole;
import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Devrait être hashé avec BCrypt en production

    @Column(nullable = false)
    private String fullName;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private Set<UserRole> roles = new HashSet<>();

    private Double reputationScore = 0.0;

    @ElementCollection
    @CollectionTable(name = "user_interest_tags", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "tag")
    private Set<String> interestTags = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "user_locales", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "locale")
    private Set<String> locales = new HashSet<>();

    // Constructeurs
    public User() {}

    public User(String email, String password, String fullName, Set<UserRole> roles) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.roles = roles != null ? roles : new HashSet<>();
    }

    // Getters et Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Set<UserRole> getRoles() {
        return roles;
    }

    public void setRoles(Set<UserRole> roles) {
        this.roles = roles;
    }

    public Double getReputationScore() {
        return reputationScore;
    }

    public void setReputationScore(Double reputationScore) {
        this.reputationScore = reputationScore;
    }

    public Set<String> getInterestTags() {
        return interestTags;
    }

    public void setInterestTags(Set<String> interestTags) {
        this.interestTags = interestTags;
    }

    public Set<String> getLocales() {
        return locales;
    }

    public void setLocales(Set<String> locales) {
        this.locales = locales;
    }
}
