package com.collectablestickers.StickerCollectingApp.repository;

import com.collectablestickers.StickerCollectingApp.entity.UserPrediction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserPredictionRepository extends JpaRepository<UserPrediction, Long> {
    List<UserPrediction> findByUserId(Long userId);

    Optional<UserPrediction> findByUserIdAndFixtureId(Long userId, Long fixtureId);
}
