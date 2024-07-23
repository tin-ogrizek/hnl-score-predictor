package com.collectablestickers.StickerCollectingApp.repository;

import com.collectablestickers.StickerCollectingApp.entity.FootballTeam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FootballTeamRepository extends JpaRepository<FootballTeam, Long> {
    FootballTeam findByClubName(String s);
}
