package com.collectablestickers.StickerCollectingApp.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TableRowDTO {
    private String position;
    private String club;
    private String matches;
    private String wins;
    private String draws;
    private String losses;
    private String goalsFor;
    private String goalsAgainst;
    private String goalDifference;
    private String points;
}
