package com.qwadwocodes.orbixa.features.profile.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.qwadwocodes.orbixa.features.profile.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByPhoneNumber(String phoneNumber);
    boolean existsByUsername(String username);
}
