package com.collectablestickers.StickerCollectingApp.controller;

import com.collectablestickers.StickerCollectingApp.dto.UserPredictionDTO;
import com.collectablestickers.StickerCollectingApp.entity.User;
import com.collectablestickers.StickerCollectingApp.entity.UserPrediction;
import com.collectablestickers.StickerCollectingApp.service.UserPredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prediction-score")
@CrossOrigin("*")
public class UserPredictionController {

    @Autowired
    private UserPredictionService userPredictionService;

    @GetMapping("/user-score")
    public ResponseEntity<Object> getOldUserPredictions(@AuthenticationPrincipal User user){
        try{
            Long userId = user.getId();
            List<UserPrediction> userPredictions = userPredictionService.getUserPredictions(userId);
            return ResponseEntity.ok(userPredictions);
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/submit-home/{fixtureId}")
    public ResponseEntity<Object> saveHomeUserPredictions(@AuthenticationPrincipal User user,
                                                      @PathVariable Long fixtureId,
                                                      @RequestBody UserPredictionDTO userPredictionDTO){
        try{
            UserPrediction userPrediction = userPredictionService.saveUserHomePrediction(userPredictionDTO.getInputResult(),
                    fixtureId, user.getId());
            if(userPrediction != null){
                return ResponseEntity.ok(userPrediction);
            } else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Pogreška.");
            }
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/submit-away/{fixtureId}")
    public ResponseEntity<Object> saveAwayUserPredictions(@AuthenticationPrincipal User user,
                                                      @PathVariable Long fixtureId,
                                                      @RequestBody UserPredictionDTO userPredictionDTO){
        try{
            UserPrediction userPrediction = userPredictionService.saveUserAwayPrediction(userPredictionDTO.getInputResult()
                    , fixtureId, user.getId());
            if(userPrediction != null){
                return ResponseEntity.ok(userPrediction);
            } else{
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Pogreška.");
            }
        } catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/leaderboards")
    public ResponseEntity<Object> getUsersAndPoints() {
        try {
            Map<String, Integer> userLeaderboard = userPredictionService.getLeaderboards();
            if(userLeaderboard != null) {
                return ResponseEntity.ok(userLeaderboard);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Pogreška.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
