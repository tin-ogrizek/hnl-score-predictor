package com.collectablestickers.StickerCollectingApp.controller;

import com.collectablestickers.StickerCollectingApp.entity.FootballTeam;
import com.collectablestickers.StickerCollectingApp.service.FootballTeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class FootballTeamController {

    @Autowired
    private FootballTeamService footballTeamService;

    @GetMapping
    public List<FootballTeam> getAllTeams() {
        return footballTeamService.getAllTeams();
    }
}
