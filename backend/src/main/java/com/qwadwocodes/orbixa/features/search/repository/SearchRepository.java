package com.qwadwocodes.orbixa.features.search.repository;

import com.qwadwocodes.orbixa.features.search.model.Search;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SearchRepository extends JpaRepository<Search, Long> {
} 
