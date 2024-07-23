package com.collectablestickers.StickerCollectingApp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Fixture fixture;

    private String homeScorePrediction;

    private String awayScorePrediction;

    private Integer fixturePoints;
}
