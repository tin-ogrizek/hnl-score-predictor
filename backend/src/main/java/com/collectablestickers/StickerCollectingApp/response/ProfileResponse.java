package com.collectablestickers.StickerCollectingApp.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponse {
    private String username;
    private LocalDate accStartDate;
    private Integer totalUserPoints;
    private Integer numOfGuessMatchdays;
    private String mostSuccessMatchday;
}
