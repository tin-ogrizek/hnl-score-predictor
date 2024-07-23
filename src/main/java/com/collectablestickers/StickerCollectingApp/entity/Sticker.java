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
public class Sticker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int number;

    private String itemName; // can be player name and surname, name of the club, team image...

    private StickerType stickerType;

    @ManyToOne(optional = false)
    private User user;
}
