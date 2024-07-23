package com.collectablestickers.StickerCollectingApp.service;

import com.collectablestickers.StickerCollectingApp.entity.FootballTeam;
import com.collectablestickers.StickerCollectingApp.repository.FootballTeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FootballTeamService {

    @Autowired
    private FootballTeamRepository footballTeamRepository;

    public List<FootballTeam> getAllTeams() {
        return footballTeamRepository.findAll();
    }
}
