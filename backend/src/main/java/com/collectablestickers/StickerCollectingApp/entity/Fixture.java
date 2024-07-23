package com.collectablestickers.StickerCollectingApp.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Fixture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String matchDay;

    @ManyToOne
    private FootballTeam homeTeam;

    @ManyToOne
    private FootballTeam awayTeam;

    private LocalDateTime gameTime;

    private String homeTeamScore;

    private String awayTeamScore;

}
