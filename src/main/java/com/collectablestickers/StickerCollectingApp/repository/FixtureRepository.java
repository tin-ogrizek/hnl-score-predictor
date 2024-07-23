package com.collectablestickers.StickerCollectingApp.repository;

import com.collectablestickers.StickerCollectingApp.entity.Fixture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FixtureRepository extends JpaRepository<Fixture, Long> {
    List<Fixture> findAllByMatchDay(String currentMatchday);
}
